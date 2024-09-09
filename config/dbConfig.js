const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Sergio2Andrea*',
    server: 'sartux2\\SQLEXPRESS', // Usa 'localhost' si estás en la misma máquina
    database: 'ClientConnect_V1',
    options: {
        encrypt: true, // Usar cifrado
        trustServerCertificate: true // Para evitar problemas con certificados auto-firmados
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};
