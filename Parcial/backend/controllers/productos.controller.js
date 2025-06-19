const { Producto } = require('../models');

const getProductos = async function(req, res) {
    try {
        const productos = await Producto.findAll();
        res.status(200).json({ productos });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getProductosPage = async function(req, res) {
    try {
        const productos = await Producto.findAll();
        res.render('productos', { productos });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const postProducto = async function(req, res) {
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || !precio || !descripcion) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const nuevo = await Producto.create({ nombre, precio, descripcion });
        res.status(201).json({ message: 'Producto creado', id: nuevo.id });
    } catch (err) {
        console.error('Error al insertar producto:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateProducto = async function(req, res) {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || !precio || !descripcion) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const [actualizados] = await Producto.update(
            { nombre, precio, descripcion },
            { where: { id } }
        );
        if (actualizados === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).json({ message: 'Producto actualizado' });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const deleteProducto = async function(req, res) {
    const { id } = req.params;

    try {
        const eliminados = await Producto.destroy({ where: { id } });
        if (eliminados === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    getProductosPage,
    getProductos,
    postProducto,
    updateProducto,
    deleteProducto
};
