// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/dbConfig'); // Asegúrate de importar sql


const login = async (req, res) => {
    const { Nombre_Usuario, Clave } = req.body;

    if (!Nombre_Usuario || !Clave) {
        return res.status(400).json({ message: 'Por favor ingrese todos los campos.' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('Nombre_Usuario', sql.NVarChar, Nombre_Usuario)
            .query('SELECT * FROM Usuarios WHERE Nombre_Usuario = @Nombre_Usuario');

        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(Clave, user.Clave);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        const token = jwt.sign({ userId: user.ID, role: user.Rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user.ID,
                Nombre_Usuario: user.Nombre_Usuario,
                Rol: user.Rol
            }
        });
    } catch (error) {
        console.error('Error en el servidor:', error); // Esto imprime el error en la consola del servidor
        res.status(500).json({ message: 'Error en el servidor', error: error.message || error });
    }
};


module.exports = {
    login
};
