const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.getUsuarios);

router.post('/', usuariosController.registrarUsuario)

module.exports = router
