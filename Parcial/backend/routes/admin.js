const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller');
const productsController = require('../controllers/products.controller');

router.post('/loginPage', usersController.getUserPage);

router.post('/login', usersController.userLogin);

router.get('/', usersController.getUserHomePage);

router.get('/usuarios', usersController.getUserPage);

router.post('/usuarios', usersController.postUser);

router.put('/usuarios/:id', usersController.updateUser);

router.delete('/usuarios/:id', usersController.deleteUser)

router.get('/productos', productsController.getProductsPage);

router.post('/productos/', productsController.postProduct)

router.put('/productos/:id', productsController.updateProduct);

router.delete('/productos/:id', productsController.deleteProduct)

module.exports = router
