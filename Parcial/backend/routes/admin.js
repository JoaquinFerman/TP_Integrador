const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller');
const productsController = require('../controllers/products.controller');

router.post('/loginPage', usersController.getUsuariosPage);

router.post('/login', usersController.loginUsuario);

router.get('/', usersController.getUsuarioHomePage);

router.get('/usuarios', usersController.getUsuariosPage);

router.post('/usuarios', usersController.registrarUsuario);

router.put('/usuarios/:id', usersController.updateUsuario);

router.delete('/usuarios/:id', usersController.deleteUsuario)

router.get('/productos', productsController.getProductsPage);

router.post('/productos/', productsController.postProduct)

router.put('/productos/:id', productsController.updateProduct);

router.delete('/productos/:id', productsController.deleteProduct)

module.exports = router
