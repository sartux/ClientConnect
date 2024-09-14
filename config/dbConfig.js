// dbConfig.js
const sql = require('mssql');
require('dotenv').config(); // Cargar variables de entorno

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Usar cifrado
        trustServerCertificate: true // Para evitar problemas con certificados auto-firmados
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conexión exitosa a la base de datos');
        return pool;
    })
    .catch(err => {
        console.error('Fallo en la conexión a la base de datos:', err);
        process.exit(1); // Detén el proceso si la conexión falla
    });

module.exports = {
    sql, poolPromise
};
