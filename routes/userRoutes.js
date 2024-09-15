// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para recuperación de contraseña
router.post('/send-reset-code', userController.sendResetCode);

// Ruta para validar el código de verificación
router.post('/validate-reset-code', userController.validateResetCode);

// Ruta para actualizar la contraseña
router.post('/update-password', userController.updatePassword);

module.exports = router;
