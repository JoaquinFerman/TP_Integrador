const { productsGet, productPost, productUpdate, productDelete } = require('../services/products.service')

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
        const result = await productsGet(whereClauses, limit, offset, order)
        
        res.status(200).json({ products: result.rows, count: result.count });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getProductsPage = async function(req, res) {
    const { category } = req.params
    try {
        let clause
        if(category != 'todas'){
            clause = { category : category }
        } else {
            clause = {}
        }
        const products = await productsGet(clause);
        res.render('products', { products });
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

    let newId
    try {
        newId = await productPost(fields, res)
    } catch (e) {
        return res.status(400).json({ error: e.message || String(e) })
    }

    res.status(201).json({ message: 'Producto creado', id: newId });
};

const updateProduct = async function(req, res) {
    const { id } = req.params;
    const { name, price, category, description, active } = req.body;
    
    if (!name && !price && !category &&!description && !active) {
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
        await productUpdate(fields)
    } catch (e) {
        res.status(400).json({ error: e.message || String(e) })
    }

    res.status(200).json({ message: 'Producto actualizado' });
};

const deleteProduct = async function(req, res) {
    const { id } = req.params;
    try {
        await productDelete(id)
    } catch (e) {
        res.status(400).json({ error: e.message || String(e) })
    }
    res.status(204).json({ message: 'Producto eliminado' });
};

module.exports = {
    getProductsPage,
    getProducts,
    postProduct,
    updateProduct,
    deleteProduct
};
