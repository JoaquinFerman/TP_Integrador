const { Product } = require('../models');
const { checkProduct } = require('../services/checkers');

const getProducts = async function(req, res) {
    const { offset = 0, category = 'todas', name = '', min = 0, max = 0, order = 'mayor', limit = 10 } = req.query;
    try {
        const { Op } = require('sequelize');
        let products;
        const whereClauses = { active: true };
        if (category !== 'todas') {
            whereClauses.category = category;
        }
        if (name !== '') {
            whereClauses.name = { [Op.like]: `%${name}%` };
        }
        if (min > 0 || max > 0) {
            whereClauses.price = {};
            if (min > 0) {
                whereClauses.price[Op.gte] = min;
            }
            if (max > 0) {
                whereClauses.price[Op.lte] = max;
            }
        }
        const result = await Product.findAndCountAll({
            where: whereClauses,
            limit,
            offset: parseInt(offset, 10),
            order: [['price', order == 'mayor' ? 'DESC' : 'ASC']]
        });
        res.status(200).json({ products: result.rows, count: result.count });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getProductsPage = async function(req, res) {
    try {
        const products = await Product.findAll();
        res.render('productos', { products });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const postProduct = async function(req, res) {
    const { name, price, category = 'zapatilla', description } = req.body;
    if (!name || !price || !category || !description) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    fields = {
        name,
        price,
        category,
        description
    }    

    try {
        fields = await checkProduct(fields)
    } catch(e) {
        return res.status(400).json({ error: e.message || String(e) })
    }

    try {
        const newProduct = await Product.create({ name, price, category, description, active : 1 });
        res.status(201).json({ message: 'Producto creado', id: newProduct.id });
    } catch (err) {
        console.error('Error al insertar producto:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateProduct = async function(req, res) {
    const { id } = req.params;
    const { name, price, category, description, active } = req.body;
    
    if (!name && !price && !description && !active) {
        return res.status(400).json({ error: 'Al menos un campo debe ser actualizado' });
    }

    console.log(active);
    

    let fields = {
        id : id,
        name : name,
        price : price,
        category : category,
        description : description,
        active : active
    };
    try {
        fields = await checkProduct(fields)
    } catch(e) {
        return res.status(400).json({ error: e.message || String(e) })
    }

    try {
        const [updated] = await Product.update(
            { name: fields.name, price: fields.price, description: fields.description, active: fields.active },
            { where: { id: id } }
        );
        if (updated === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto actualizado' });
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const deleteProduct = async function(req, res) {
    const { id } = req.params;

    try {
        const destroyed = await Product.destroy({ where: { id } });
        if (destroyed === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    getProductsPage,
    getProducts,
    postProduct,
    updateProduct,
    deleteProduct
};
