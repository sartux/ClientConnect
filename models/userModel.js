const { poolPromise } = require('../config/dbConfig');

// Obtener todos los usuarios
const getAllUsers = async () => {
    const pool = await poolPromise;
    const result = await pool.request()
        .query('SELECT * FROM Users');
    return result.recordset;
};

// Crear un nuevo usuario
const createUser = async (user) => {
    const pool = await poolPromise;
    const { email, password } = user;
    const result = await pool.request()
        .input('email', email)
        .input('password', password)
        .query(`
            INSERT INTO Users (email, password)
            VALUES (@email, @password)
        `);
    return result.rowsAffected;
};

// Obtener un usuario por ID
const getUserById = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', id)
        .query('SELECT * FROM Users WHERE ID = @id');
    return result.recordset[0];
};

// Actualizar un usuario por ID
const updateUserById = async (id, user) => {
    const pool = await poolPromise;
    const { email, password } = user;
    const result = await pool.request()
        .input('id', id)
        .input('email', email)
        .input('password', password)
        .query(`
            UPDATE Users
            SET email = @email,
                password = @password
            WHERE ID = @id
        `);
    return result.rowsAffected;
};

// Eliminar un usuario por ID
const deleteUserById = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', id)
        .query('DELETE FROM Users WHERE ID = @id');
    return result.rowsAffected;
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
};
