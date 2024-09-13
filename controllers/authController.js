// authController.js
const emailService = require('../utils/emailService');
const { poolPromise } = require('../config/dbConfig');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

// Función para iniciar sesión y redirigir al dashboard
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email', email)
            .query('SELECT * FROM Usuarios WHERE Email = @Email');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.Clave);
        
        if (isMatch) {
            res.status(200).json({ message: 'Login exitoso', redirectUrl: '/dashboard' });
        } else {
            res.status(400).json({ message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};


// Función para enviar un código de recuperación
exports.sendRecoveryCode = async (req, res) => {
    const { email } = req.body;
    const recoveryCode = crypto.randomBytes(3).toString('hex');
    const expirationTime = moment().add(15, 'minutes').toDate();

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Email', email)
            .input('RecoveryCode', recoveryCode)
            .input('RecoveryCodeExpiration', expirationTime)
            .query(`
                UPDATE Usuarios
                SET RecoveryCode = @RecoveryCode, RecoveryCodeExpiration = @RecoveryCodeExpiration
                WHERE Email = @Email
            `);

        await emailService.sendEmail(email, 'Recuperación de Contraseña', `Tu código de recuperación es: ${recoveryCode}`);
        res.status(200).json({ message: 'Código de recuperación enviado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el código de recuperación', error });
    }
};


// Función para cambiar la contraseña
exports.changePassword = async (req, res) => {
    const { email, recoveryCode, newPassword } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email', email)
            .input('RecoveryCode', recoveryCode)
            .query('SELECT * FROM Usuarios WHERE Email = @Email AND RecoveryCode = @RecoveryCode');

        if (result.recordset.length > 0) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.request()
                .input('Email', email)
                .input('NewPassword', hashedPassword)
                .query('UPDATE Usuarios SET Clave = @NewPassword, RecoveryCode = NULL WHERE Email = @Email');

            res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
        } else {
            res.status(400).json({ message: 'Código de recuperación inválido' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la contraseña', error });
    }
};

// Verificar el código de recuperación
exports.checkRecoveryCode = async (req, res) => {
    const { email, recoveryCode } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email', email)
            .input('RecoveryCode', recoveryCode)
            .query('SELECT * FROM Usuarios WHERE Email = @Email AND RecoveryCode = @RecoveryCode');

        if (result.recordset.length > 0) {
            res.status(200).json({ message: 'Código de recuperación válido' });
        } else {
            res.status(400).json({ message: 'Código de recuperación inválido' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el código de recuperación', error });
    }
};

// Actualizar la contraseña
exports.updatePassword = async (req, res) => {
    const { email, recoveryCode, newPassword } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/; // Mínimo 8 caracteres, al menos una letra mayúscula, una letra minúscula, un número y permite caracteres especiales
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.' });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email', email)
            .input('RecoveryCode', recoveryCode)
            .query(`
                SELECT * FROM Usuarios
                WHERE Email = @Email
                AND RecoveryCode = @RecoveryCode
                AND RecoveryCodeExpiration > GETDATE()
            `);

        if (result.recordset.length > 0) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.request()
                .input('Email', email)
                .input('NewPassword', hashedPassword)
                .query(`
                    UPDATE Usuarios
                    SET Clave = @NewPassword, RecoveryCode = NULL, RecoveryCodeExpiration = NULL
                    WHERE Email = @Email
                `);

            res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        } else {
            res.status(400).json({ message: 'Código de recuperación inválido o expirado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña', error });
    }
};
