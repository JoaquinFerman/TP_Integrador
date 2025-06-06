const express = require('express')
const router = express.Router()
const productosController = require('../controllers/productos.controller');

router.get('/', productosController.getProductos);

router.post('/', productosController.postProducto)

router.put('/:id', productosController.updateProducto);

router.delete('/:id', productosController.deleteProducto)

module.exports = router
