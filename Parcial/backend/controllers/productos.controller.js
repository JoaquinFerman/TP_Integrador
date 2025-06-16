const db = require('../services/db')

const getProductos = function(req, res) {
    const query = 'SELECT * FROM Productos';

    db.all(query, (err, productos) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.status(200).json({'productos' : productos});
    });
}

const getProductosPage = function(req, res) {
    const query = 'SELECT * FROM Productos';

    db.all(query, (err, productos) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.render('productos', { productos });
    });
}

const postProducto = function(req, res) {
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || !precio || !descripcion) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const query = `
    INSERT INTO Productos (nombre, precio, descripcion)
    VALUES (?, ?, ?)`;
    db.all(query, [nombre, precio, descripcion], (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.status(201).json({ message: 'Producto creado', id: result.insertId });
    });
}

const updateProducto = function(req, res) {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || !precio || !descripcion) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const query = `
        UPDATE Productos
        SET nombre = ?, precio = ?, descripcion = ?
        WHERE id = ?`;
    db.all(query, [nombre, precio, descripcion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).json({ message: 'Producto actualizado' });
    });
}

const deleteProducto = function(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM Productos WHERE id = ?';
    db.all(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).json({ message: 'Producto eliminado' });
    });
}

module.exports = {
    getProductosPage,
    getProductos,
    postProducto,
    updateProducto,
    deleteProducto
};