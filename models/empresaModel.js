const { poolPromise } = require('../config/dbConfig');

const getAll = async () => {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('SELECT * FROM Empresas');
    return result.recordset;
};

const create = async (empresa) => {
    const pool = await poolPromise;
    const { Nombre, Persona_Natural_o_Juridica, Nit_o_CC, Razón_Social, Plan, fecha_de_plan, fecha_vencimiento, cuenta_bancaria } = empresa;
    const result = await pool.request()
        .input('Nombre', Nombre)
        .input('Persona_Natural_o_Juridica', Persona_Natural_o_Juridica)
        .input('Nit_o_CC', Nit_o_CC)
        .input('Razón_Social', Razón_Social)
        .input('Plan', Plan)
        .input('fecha_de_plan', fecha_de_plan)
        .input('fecha_vencimiento', fecha_vencimiento)
        .input('cuenta_bancaria', cuenta_bancaria)
        .query(`
            INSERT INTO Empresas (Nombre, Persona_Natural_o_Juridica, Nit_o_CC, Razón_Social, Plan, fecha_de_plan, fecha_vencimiento, cuenta_bancaria)
            VALUES (@Nombre, @Persona_Natural_o_Juridica, @Nit_o_CC, @Razón_Social, @Plan, @fecha_de_plan, @fecha_vencimiento, @cuenta_bancaria)
        `);
    return result.rowsAffected;
};

// Implementa las funciones getById, update y delete de manera similar

module.exports = {
    getAll,
    create,
    // Exporta otras funciones según sea necesario
};
