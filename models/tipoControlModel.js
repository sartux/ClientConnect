const { poolPromise } = require('../config/dbConfig');

const getAll = async () => {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('SELECT * FROM Tipo_Control');
    return result.recordset;
};

const create = async (tipoControl) => {
    const pool = await poolPromise;
    const { Nombre, estado } = tipoControl;
    const result = await pool.request()
        .input('Nombre', Nombre)
        .input('estado', estado)
        .query(`
            INSERT INTO Tipo_Control (Nombre, estado)
            VALUES (@Nombre, @estado)
        `);
    return result.rowsAffected;
};

// Implementa las funciones getById, update y delete de manera similar

module.exports = {
    getAll,
    create,
    // Exporta otras funciones según sea necesario
};
