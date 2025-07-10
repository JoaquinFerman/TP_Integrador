const { Product } = require('../models');
const { checkProduct } = require('./checkers');
const fs = require('fs');
const path = require('path');

const productsGet = async function (whereClauses = {}, limit = 0, offset = 0, order = 'mayor') {
    return await Product.findAndCountAll({
        where: whereClauses,
        limit: limit == 0 ? null : limit,
        offset: parseInt(offset, 10),
        order: [['price', order == 'mayor' ? 'DESC' : 'ASC']]
    });
}

const productPost = async function (fields) {
    try {
        fields = await checkProduct(fields)
    } catch(e) {
        throw new Error(e.message || String(e))
    }

    try {
        const newProduct = await Product.create({ name : fields.name, price : fields.price, category : fields.category, description : fields.description, active : 1 });
        return newProduct.id
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

    let oldProduct;
    try {
        oldProduct = await Product.findByPk(fields.id);
        if (!oldProduct) {
            throw new Error('Producto no encontrado');
        }
    } catch (err) {
        throw new Error('Error al buscar el producto');
    }

    try {
        const [updated] = await Product.update(
            { name: fields.name, price: fields.price, category: fields.category, description: fields.description, active: fields.active },
            { where: { id: fields.id } }
        );
        if (updated === 0) {
            throw new Error('Producto no encontrado');
        }

        if (fields.name !== oldProduct.name) {
            const imagesDir = path.join(__dirname, '../../Public/images');
            const oldImagePath = path.join(imagesDir, `${oldProduct.name}.webp`);
            const newImagePath = path.join(imagesDir, `${fields.name}.webp`);
            if (fs.existsSync(oldImagePath)) {
                fs.renameSync(oldImagePath, newImagePath);
            }
        }
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        throw new Error('Error en el servidor');
    }
}

const productDelete = async function (id) {
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        const destroyed = await Product.destroy({ where: { id } });
        if (destroyed === 0) {
            throw new Error('Producto no encontrado');
        }

        const imagesDir = path.join(__dirname, '../../Public/images');
        const imagePath = path.join(imagesDir, `${product.name}.webp`);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
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