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

router.delete('/:id', (req, res) => {
    // Eliminar producto por ID
})

module.exports = router
