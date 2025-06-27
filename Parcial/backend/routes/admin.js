const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller');
const productsController = require('../controllers/products.controller');
const upload = require('../services/upload');

router.post('/loginPage', usersController.getUserPage);

router.post('/login', usersController.userLogin);

router.get('/', usersController.getUserHomePage);

router.get('/usuarios', usersController.getUserPage);

router.post('/usuarios', usersController.postUser);

router.put('/usuarios/:id', usersController.updateUser);

router.delete('/usuarios/:id', usersController.deleteUser)

router.get('/productos', productsController.getProductsPage);

router.post('/productos/', upload.single('photo'), productsController.postProduct)

router.put('/productos/:id', productsController.updateProduct);

router.delete('/productos/:id', productsController.deleteProduct)

module.exports = router
