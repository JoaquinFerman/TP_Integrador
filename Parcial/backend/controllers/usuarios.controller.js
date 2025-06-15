const db = require('../services/db')

const getUsuarioHomePage = function(req, res) {
    return res.render('index')
}

const getUsuariosPage = function(req, res) {
    const query = 'SELECT * FROM Usuarios';
    
    db.query(query, (err, usuarios) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.render('usuarios', { usuarios })
    });
}

const registrarUsuario = function(req, res) {
    const { nombre, password } = req.body;
    if (!nombre || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const query = `
    INSERT INTO Usuarios (nombre, password)
    VALUES (?, ?)`;
    db.query(query, [nombre, password], (err, result) => {
        if (err) {
            console.error('Error al insertar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    });
}

const updateUsuario = function(req, res) {
    const { id } = req.params;
    const { nombre, password } = req.body;
    if (!nombre || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const query = `
        UPDATE Usuarios
        SET nombre = ?, password = ?
        WHERE id = ?`;
    db.query(query, [nombre, password, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).json({ message: 'Usuario actualizado' });
    });
}

module.exports = {
    getUsuarioHomePage,
    getUsuariosPage,
    registrarUsuario,
    updateUsuario
}