// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const empresaRoutes = require('./routes/empresaRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Asegúrate de importar correctamente

const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Definición de rutas
app.use('/api', empresaRoutes);
app.use('/api/user', userRoutes);
app.use('/api', authRoutes); // Agregar correctamente las rutas de autenticación

// Rutas de vistas
app.get('/login', (req, res) => res.sendFile(__dirname + '/views/login.html'));
app.get('/recuperar-password', (req, res) => res.sendFile(__dirname + '/views/recuperarPassword.html'));
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Definición del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
