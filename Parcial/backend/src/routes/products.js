const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products.controller');
const upload = require('../middlewares/upload');

router.get('/', productsController.getProducts);

router.post('/', upload.single('photo'), productsController.postProduct)

router.put('/:id', productsController.updateProduct);

router.delete('/:id', productsController.deleteProduct)

module.exports = router
