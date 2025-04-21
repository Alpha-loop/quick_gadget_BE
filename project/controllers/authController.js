const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
    const { name, email, password, passwordConfirm } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ status: 'success', token, data: { user } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
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