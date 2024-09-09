const express = require('express');
const bodyParser = require('body-parser');
const empresaRoutes = require('./routes/empresaRoutes'); // Ruta correcta a `empresaRoutes.js`

const app = express();
app.use(bodyParser.json());
app.use('/api', empresaRoutes); // Usa las rutas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
