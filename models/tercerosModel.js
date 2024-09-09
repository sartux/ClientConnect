const { poolPromise } = require('../config/dbConfig');

const getAll = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Terceros');
        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching Terceros: ' + error.message);
    }
};

const create = async (tercero) => {
    try {
        const pool = await poolPromise;
        const { EMPRESA_ID, Nombre, Persona_Natural_o_Juridica, Nit_o_CC, Apellido, Razón_Social, Dirección, Ciudad, Tel_Contacto, Correo_Contacto, Correo_Facturación_Electrónica, Fecha_Cumpleaños, Perfil } = tercero;
        const result = await pool.request()
            .input('EMPRESA_ID', EMPRESA_ID)
            .input('Nombre', Nombre)
            .input('Persona_Natural_o_Juridica', Persona_Natural_o_Juridica)
            .input('Nit_o_CC', Nit_o_CC)
            .input('Apellido', Apellido)
            .input('Razón_Social', Razón_Social)
            .input('Dirección', Dirección)
            .input('Ciudad', Ciudad)
            .input('Tel_Contacto', Tel_Contacto)
            .input('Correo_Contacto', Correo_Contacto)
            .input('Correo_Facturación_Electrónica', Correo_Facturación_Electrónica)
            .input('Fecha_Cumpleaños', Fecha_Cumpleaños)
            .input('Perfil', Perfil)
            .query(`
                INSERT INTO Terceros (EMPRESA_ID, Nombre, Persona_Natural_o_Juridica, Nit_o_CC, Apellido, Razón_Social, Dirección, Ciudad, Tel_Contacto, Correo_Contacto, Correo_Facturación_Electrónica, Fecha_Cumpleaños, Perfil)
                VALUES (@EMPRESA_ID, @Nombre, @Persona_Natural_o_Juridica, @Nit_o_CC, @Apellido, @Razón_Social, @Dirección, @Ciudad, @Tel_Contacto, @Correo_Contacto, @Correo_Facturación_Electrónica, @Fecha_Cumpleaños, @Perfil)
            `);
        return result.rowsAffected;
    } catch (error) {
        throw new Error('Error creating Tercero: ' + error.message);
    }
};

// Implementa las funciones getById, update y delete de manera similar

module.exports = {
    getAll,
    create,
    // Exporta otras funciones según sea necesario
};
