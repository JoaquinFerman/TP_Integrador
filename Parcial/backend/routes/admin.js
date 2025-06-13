const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuarios.controller');
const productosController = require('../controllers/productos.controller');

router.get('/', usuariosController.getUsuarioHomePage);

router.get('/usuarios', usuariosController.getUsuariosPage)

router.post('/usuarios', usuariosController.registrarUsuario)

router.get('/productos', productosController.getProductosPage);

module.exports = router
