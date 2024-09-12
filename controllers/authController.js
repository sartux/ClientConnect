const emailService = require('../utils/emailService');
const { poolPromise } = require('../config/dbConfig');
const crypto = require('crypto');  // Para generar códigos de recuperación únicos
const bcrypt = require('bcrypt');
const moment = require('moment');  // Importa moment para manejar fechas

// Ejemplo de función para enviar un código de recuperación
exports.sendRecoveryCode = async (req, res) => {
    const { email } = req.body;
    const recoveryCode = crypto.randomBytes(3).toString('hex'); // Genera un código de recuperación único
    const expirationTime = moment().add(15, 'minutes').toDate(); // Código expira en 15 minutos

    try {
        // Guardar el código de recuperación en la base de datos
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

        // Enviar correo electrónico con el código de recuperación
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
        // Verificar el código de recuperación
        const result = await pool.request()
            .input('Email', email)
            .input('RecoveryCode', recoveryCode)
            .query('SELECT * FROM Usuarios WHERE Email = @Email AND RecoveryCode = @RecoveryCode');

        if (result.recordset.length > 0) {
            // Encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Actualizar la contraseña
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
    // Validación de la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/; // Mínimo 8 caracteres, al menos una letra mayúscula, una letra minúscula, un número y permite caracteres especiales
        if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.' });
    }
    try {
        const pool = await poolPromise;
        // Verificar el código de recuperación
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
            // Encriptar la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Actualizar la contraseña
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