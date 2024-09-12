// testEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // Usa `true` para el puerto 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.sendMail({
    from: `"Test" <${process.env.EMAIL_USER}>`,
    to: 'test@example.com', // Cambia esto por una dirección de correo válida
    subject: 'Test Email',
    text: 'Este es un correo de prueba.'
}, (error, info) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Email enviado:', info.response);
    }
});
