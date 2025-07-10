const { productsGet } = require('../services/products.service')
const { salesGet } = require('../services/sales.service')
const { User } = require('../models');

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

const getSalesPage = async (req, res) => {
    try {
        const sales = await salesGet(['name']);
        res.render('sales', { sales });
    } catch (err) {
        console.error('Error al obtener ventas:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const getUserHomePage = (req, res) => {
  return res.render('index');
};

const getUserPage = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users', { users });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
    getProductsPage,
    getSalesPage,
    getUserHomePage,
    getUserPage
}