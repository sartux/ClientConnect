// utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Asegúrate de que las variables de entorno están cargadas

// Configura el transporte SMTP usando las variables de entorno
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Por ejemplo, 'mail.cootranstame.co'
    port: process.env.EMAIL_PORT, // Por ejemplo, 465
    secure: true, // Usa `true` para puerto 465, `false` para otros puertos
    auth: {
        user: process.env.EMAIL_USER, // Por ejemplo, 'sistemas@cootranstame.co'
        pass: process.env.EMAIL_PASS  // La contraseña de la cuenta de correo
    }
});

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_USER}>`, // Dirección del remitente
            to,
            subject,
            text
        });
        console.log('Email enviado exitosamente');
    } catch (error) {
        console.error('Error enviando el correo:', error);
        throw error; // Re-lanza el error para que sea manejado por el controlador
    }
};

module.exports = {
    sendEmail
};
