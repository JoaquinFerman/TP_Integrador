const db = require('../services/db')
const bcrypt = require('bcrypt');

const getUsuarioHomePage = function(req, res) {
    return res.render('index')
}

const getUsuariosPage = function(req, res) {
    const query = 'SELECT * FROM Usuarios';
    
    db.all(query, (err, usuarios) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.render('usuarios', { usuarios })
    });
}

const getUsuarios = function(req, res) {
    const query = 'SELECT * FROM Usuarios';

    db.all(query, (err, usuarios) => {
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
        db.all(query, [nombre, hashedPassword], (err, result) => {
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
    db.all(query, [nombre, password, id], (err, result) => {
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
    db.all(query, [id], (err, result) => {
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
    db.all(query, [nombre], (err, results) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        let usuarioValido = null;
        let pending = results.length;
        if (pending === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        results.forEach(usuario => {
            bcrypt.compare(password, usuario.password, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err);
                if (pending > 0) pending--;
                if (pending === 0 && !usuarioValido) {
                return res.status(500).json({ error: 'Error en el servidor' });
                }
                return;
            }
            if (isMatch && !usuarioValido) {
                usuarioValido = usuario;
                return res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: { id: usuario.id, nombre: usuario.nombre } });
            }
            pending--;
            if (pending === 0 && !usuarioValido) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }
            });
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