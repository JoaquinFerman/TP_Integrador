const db = require('../services/db')
const bcrypt = require('bcrypt');

const getUsuarioHomePage = function(req, res) {
    return res.render('index')
}

const getUsuariosPage = function(req, res) {
    const query = 'SELECT * FROM Usuarios';
    
    db.query(query, (err, usuarios) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.render('usuarios', { usuarios })
    });
}

const getUsuarios = function(req, res) {
    const query = 'SELECT * FROM Usuarios';

    db.query(query, (err, usuarios) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.status(200).json({'usuarios' : usuarios});
    });
}

const registrarUsuario = function(req, res) {
    const { nombre, password } = req.body;
    if (!nombre || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error al encriptar la contraseña:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        const query = `
        INSERT INTO Usuarios (nombre, password)
        VALUES (?, ?)`;
        db.query(query, [nombre, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error al insertar usuario:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            res.status(201).json({ message: 'Usuario creado', id: result.insertId });
        });
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

const deleteUsuario = function(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM Usuarios WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).json({ message: 'Usuario eliminado' });
    });
}

const loginUsuario = function(req, res) {
    const { nombre, password } = req.body;
    if (!nombre || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const query = 'SELECT * FROM Usuarios WHERE nombre = ?';
    db.query(query, [nombre], (err, results) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        const usuario = results[0];
        bcrypt.compare(password, usuario.password, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }
            res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: { id: usuario.id, nombre: usuario.nombre } });
        });
    });
}

module.exports = {
    getUsuarios,
    getUsuarioHomePage,
    getUsuariosPage,
    registrarUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario
}