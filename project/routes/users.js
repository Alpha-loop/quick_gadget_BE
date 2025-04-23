const express = require('express');
const { signup, login, verifyPhone, requestPasswordReset, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/verifyPhone', verifyPhone);
router.post('/password-reset-request', requestPasswordReset);
router.post('/password-reset', resetPassword);

module.exports = router;