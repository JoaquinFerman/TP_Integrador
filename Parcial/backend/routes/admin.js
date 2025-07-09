const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller');
const productsController = require('../controllers/products.controller');
const salesController = require('../controllers/sales.controller')

router.get('/', usersController.getUserHomePage);

router.get('/usuarios', usersController.getUserPage);

router.get('/productos/:category', productsController.getProductsPage);

router.get('/ventas', salesController.getSalesPage)

module.exports = router
