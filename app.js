const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Importa el módulo path para trabajar con rutas de archivos
const empresaRoutes = require('./routes/empresaRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Agrega la ruta de autenticación

const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Configuración de la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Definición de rutas
app.use('/api', empresaRoutes); // Usa las rutas existentes
app.use('/api/user', userRoutes);
app.use('/api', authRoutes); // Asegúrate d

// Rutas de vistas
app.get('/login', (req, res) => res.sendFile(__dirname + '/views/login.html'));
app.get('/recuperar-password', (req, res) => res.sendFile(__dirname + '/views/recuperarPassword.html'));


// Definición del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
