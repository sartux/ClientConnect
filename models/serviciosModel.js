const { poolPromise } = require('../config/dbConfig');

const getAll = async () => {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('SELECT * FROM Servicios');
    return result.recordset;
};

const create = async (servicio) => {
    const pool = await poolPromise;
    const { Nombre_del_servicio, Categoría, Sub_categoria, estado, permitir_documentos, histórico_documentos, Tipo_control, Fechas_vencimiento } = servicio;
    const result = await pool.request()
        .input('Nombre_del_servicio', Nombre_del_servicio)
        .input('Categoría', Categoría)
        .input('Sub_categoria', Sub_categoria)
        .input('estado', estado)
        .input('permitir_documentos', permitir_documentos)
        .input('histórico_documentos', histórico_documentos)
        .input('Tipo_control', Tipo_control)
        .input('Fechas_vencimiento', Fechas_vencimiento)
        .query(`
            INSERT INTO Servicios (Nombre_del_servicio, Categoría, Sub_categoria, estado, permitir_documentos, histórico_documentos, Tipo_control, Fechas_vencimiento)
            VALUES (@Nombre_del_servicio, @Categoría, @Sub_categoria, @estado, @permitir_documentos, @histórico_documentos, @Tipo_control, @Fechas_vencimiento)
        `);
    return result.rowsAffected;
};

// Implementa las funciones getById, update y delete de manera similar

module.exports = {
    getAll,
    create,
    // Exporta otras funciones según sea necesario
};
