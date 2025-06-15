const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuarios.controller');
const productosController = require('../controllers/productos.controller');

router.post('/loginPage', usuariosController.getUsuariosPage);

router.post('/login', usuariosController.loginUsuario);

router.get('/', usuariosController.getUsuarioHomePage);

router.get('/usuarios', usuariosController.getUsuariosPage);

router.post('/usuarios', usuariosController.registrarUsuario);

router.put('/usuarios/:id', usuariosController.updateUsuario);

router.delete('/usuarios/:id', usuariosController.deleteUsuario)

router.get('/productos', productosController.getProductosPage);

module.exports = router
