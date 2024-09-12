// routes/authRoutes.js
const express = require('express');
const { checkRecoveryCode, updatePassword } = require('../controllers/authController');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-recovery-code', authController.sendRecoveryCode);
router.post('/change-password', authController.changePassword);
router.post('/verify-recovery-code', checkRecoveryCode);
router.post('/update-password', updatePassword);


module.exports = router;
