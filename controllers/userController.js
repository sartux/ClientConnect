// userController.js
const db = require('../config/dbConfig'); // Tu configuración de base de datos
const emailService = require('../utils/emailService'); // Módulo para enviar correos
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');

// Enviar código de verificación al correo
exports.sendResetCode = async (req, res) => {
    const { username } = req.body;
    
    try {
        const user = await db.query('SELECT Email FROM Usuarios WHERE Nombre_Usuario = ?', [username]);
        
        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const email = user[0].Email;
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '30m' });

        // Envía un email con el código de verificación (o token)
        await emailService.sendEmail(email, 'Código de recuperación', `Tu código de recuperación es: ${token}`);

        return res.json({
            message: `El código fue enviado al correo ${email.replace(/(.{2})(.*)(?=@)/,
                (_, first, middle) => `${first}${"*".repeat(middle.length)}`)}`
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error al enviar el código de recuperación' });
    }
};

// Validar el código de recuperación
exports.validateResetCode = (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ message: 'Código válido', username: decoded.username });
    } catch (error) {
        return res.status(400).json({ message: 'Código inválido o expirado' });
    }
};

// Actualizar la contraseña
exports.updatePassword = async (req, res) => {
    const { username, newPassword } = req.body;

    // Validar que la contraseña cumpla con los criterios de seguridad
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'La contraseña no cumple con los requisitos de seguridad' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        await db.query('UPDATE Usuarios SET Clave = ? WHERE Nombre_Usuario = ?', [hashedPassword, username]);
        return res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
};
