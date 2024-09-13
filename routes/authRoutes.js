// routes/authRoutes.js
const express = require('express');
const { checkRecoveryCode, updatePassword } = require('../controllers/authController');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/login', authController.login); // Asegúrate de que esta ruta esté definida

// Otras rutas
router.post('/send-recovery-code', authController.sendRecoveryCode);
router.post('/change-password', authController.changePassword);
router.post('/verify-recovery-code', authController.checkRecoveryCode);
router.post('/update-password', authController.updatePassword);

module.exports = router;
