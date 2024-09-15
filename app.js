// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Importa la configuración de la base de datos
const { poolPromise } = require('./config/dbConfig');

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');  // Añade las rutas de recuperación de contraseña

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);  // Añade el prefijo /api para las rutas de usuario

// Definición del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
