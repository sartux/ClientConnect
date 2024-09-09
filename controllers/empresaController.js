const empresaModel = require('../models/empresaModel'); // Verifica que esta ruta es correcta

const getAllEmpresas = async (req, res) => {
    try {
        const empresas = await empresaModel.getAll();
        res.json(empresas);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createEmpresa = async (req, res) => {
    try {
        const empresa = req.body;
        await empresaModel.create(empresa);
        res.status(201).send('Empresa creada');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Exporta las funciones necesarias
module.exports = {
    getAllEmpresas,
    createEmpresa,
    // Exporta otras funciones según sea necesario
};
