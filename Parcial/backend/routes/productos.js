const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
    const query = 'SELECT * FROM productos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json({productos : results});
    });
});

router.post('/', (req, res) => {
    const { nombre, precio, descripcion, ruta } = req.body;
    if (!nombre || !precio || !descripcion || !ruta) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const query = `
    INSERT INTO productos (nombre, precio, descripcion, ruta)
    VALUES (?, ?, ?, ?)`;
    db.query(query, [nombre, precio, descripcion, ruta], (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.status(201).json({ message: 'Producto creado', id: result.insertId });
    });
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, ruta } = req.body;
    if (!nombre || !precio || !descripcion || !ruta) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const query = `
        UPDATE productos
        SET nombre = ?, precio = ?, descripcion = ?, ruta = ?
        WHERE id = ?`;
    db.query(query, [nombre, precio, descripcion, ruta, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    });
})

module.exports = router
