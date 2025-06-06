const express = require('express')
const router = express.Router()
const db = require('../services/db')
const ventasController = require('../controllers/ventas.controller');

router.get('/', (req, res) => {
});

router.post('/', ventasController.postVenta)

module.exports = router
