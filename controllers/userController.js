// userController.js
const db = require('../config/dbConfig'); // Tu configuración de base de datos
const emailService = require('../utils/emailService'); // Módulo para enviar correos
const { generateRecoveryCode } = require('../utils/codeGenerator'); // Función para generar código
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sql = require('mssql'); // Asegúrate de importar sql si usas mssql
const moment = require('moment');

exports.sendResetCode = async (req, res) => {
    const { username } = req.body;

    try {
        const pool = await db.poolPromise;
        const result = await pool.request()
            .input('Nombre_Usuario', sql.NVarChar, username)
            .query('SELECT Email FROM Usuarios WHERE Nombre_Usuario = @Nombre_Usuario');
        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const email = user.Email;
        const recoveryCode = generateRecoveryCode();
        const expirationDate = moment().add(5, 'minutes').toDate(); // Código válido por 5 minutos

        // Actualiza el código de recuperación y su expiración en la base de datos
        await pool.request()
            .input('Nombre_Usuario', sql.NVarChar, username)
            .input('RecoveryCode', sql.NVarChar, recoveryCode)
            .input('RecoveryCodeExpiration', sql.DateTime, expirationDate)
            .query('UPDATE Usuarios SET RecoveryCode = @RecoveryCode, RecoveryCodeExpiration = @RecoveryCodeExpiration WHERE Nombre_Usuario = @Nombre_Usuario');

        // Envía un email con el código de recuperación
        await emailService.sendEmail(email, 'Código de recuperación', `Tu código de recuperación es: ${recoveryCode}`);

        return res.json({
            message: `El código fue enviado al correo ${email.replace(/(.{2})(.*)(?=@)/,
                (_, first, middle) => `${first}${"*".repeat(middle.length)}`)}`
        });

    } catch (error) {
        console.error('Error en el envío del código de recuperación:', error);
        return res.status(500).json({ message: 'Error al enviar el código de recuperación', error: error.message || error });
    }
};

// Validar el código de recuperación
exports.validateResetCode = async (req, res) => {
    const { username, code } = req.body;

    try {
        const pool = await db.poolPromise;
        const result = await pool.request()
            .input('Nombre_Usuario', sql.NVarChar, username)
            .query('SELECT RecoveryCode, RecoveryCodeExpiration FROM Usuarios WHERE Nombre_Usuario = @Nombre_Usuario');
        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.RecoveryCode !== code) {
            return res.status(400).json({ message: 'Código incorrecto' });
        }

        if (moment().isAfter(user.RecoveryCodeExpiration)) {
            return res.status(400).json({ message: `Código expirado. El código es válido por 5 minutos. Solicite uno nuevo.` });
        }

        return res.json({ message: 'Código válido' });

    } catch (error) {
        return res.status(500).json({ message: 'Error al validar el código de recuperación', error: error.message || error });
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

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const pool = await db.poolPromise;
        await pool.request()
            .input('Nombre_Usuario', sql.NVarChar, username)
            .input('Clave', sql.NVarChar, hashedPassword)
            .query('UPDATE Usuarios SET Clave = @Clave, RecoveryCode = NULL, RecoveryCodeExpiration = NULL WHERE Nombre_Usuario = @Nombre_Usuario');

        return res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        return res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message || error });
    }
};
