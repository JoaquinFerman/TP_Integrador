const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller');

router.get('/', usersController.getUsuarios);

router.post('/', usersController.registrarUsuario)

module.exports = router
