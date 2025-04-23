const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ status: 'success', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, phoneNumber } = req.body;
    if (!name || !email || !password || !passwordConfirm || !phoneNumber) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      phoneVerificationCode,
    });

    // TODO: Replace with actual SMS service (e.g., Twilio)
    console.log(`SMS to ${phoneNumber}: Your verification code is ${phoneVerificationCode}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ status: 'success', token, data: { user } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ notice: 'error', message: 'Internal server error' });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'You are not logged in' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Protect error:', error);
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
};

exports.verifyPhone = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
      return res.status(400).json({ status: 'error', message: 'Please provide phone number and code' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (user.phoneVerificationCode !== code) {
      return res.status(400).json({ status: 'error', message: 'Invalid verification code' });
    }

    user.phoneVerified = true;
    user.phoneVerificationCode = undefined;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Phone number verified' });
  } catch (error) {
    console.error('Verify phone error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Please provide email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Replace with actual email service (e.g., SendGrid)
    const resetURL = `${req.protocol}://${req.get('host')}/api/users/password-reset/${resetToken}`;
    console.log(`Email to ${email}: Reset your password at ${resetURL}`);

    res.status(200).json({ status: 'success', message: 'Password reset token sent to email' });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, passwordConfirm } = req.body;
    if (!token || !password || !passwordConfirm) {
      return res.status(400).json({ status: 'error', message: 'Please provide token, password, and password confirmation' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Token is invalid or has expired' });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ status: 'success', token: newToken, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};