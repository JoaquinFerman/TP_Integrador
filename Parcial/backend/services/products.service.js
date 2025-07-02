const { Product } = require('../models');
const { checkProduct } = require('./checkers');

const productsGet = async function (whereClauses = {}, limit = 0, offset = 0, order = 'mayor') {
    return await Product.findAndCountAll({
        where: whereClauses,
        limit: limit == 0 ? null : limit,
        offset: parseInt(offset, 10),
        order: [['price', order == 'mayor' ? 'DESC' : 'ASC']]
    });
}

const productPost = async function (fields, res) {
    try {
        fields = await checkProduct(fields)
    } catch(e) {
        throw new Error(e.message || String(e))
    }

    try {
        const newProduct = await Product.create({ name : fields.name, price : fields.price, category : fields.category, description : fields.description, active : 1 });
        res.status(201).json({ message: 'Producto creado', id: newProduct.id });
    } catch (err) {
        throw new Error('Error en el servidor');
    }
}

const productUpdate = async function (fields) {
    try {
        fields = await checkProduct(fields)
    } catch(e) {
        throw new Error(e.message || String(e))
    }

    try {
        const [updated] = await Product.update(
            { name: fields.name, price: fields.price, category: fields.category, description: fields.description, active: fields.active },
            { where: { id: fields.id } }
        );
        if (updated === 0) {
            throw new Error('Producto no encontrado');
        }
        // Producto actualizado
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        throw new Error('Error en el servidor');
    }
}

const productDelete = async function (id) {
    try {
        const destroyed = await Product.destroy({ where: { id } });
        if (destroyed === 0) {
            throw new Error('Producto no encontrado');
        }
        // Producto eliminado
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    productsGet,
    productPost,
    productUpdate,
    productDelete
}