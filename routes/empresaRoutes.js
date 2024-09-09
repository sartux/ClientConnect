const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController'); // Verifica que esta ruta es correcta

// Definición de las rutas
router.get('/empresas', empresaController.getAllEmpresas); // Asegúrate de que `getAllEmpresas` esté definido en `empresaController.js`
router.post('/empresas', empresaController.createEmpresa);

// Más rutas aquí...

module.exports = router;
