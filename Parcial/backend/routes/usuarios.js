const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.getUsuarioHomePage);

router.post('/', usuariosController.registrarUsuario)

module.exports = router
