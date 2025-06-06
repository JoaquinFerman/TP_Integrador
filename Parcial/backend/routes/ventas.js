const express = require('express')
const router = express.Router()
const ventasController = require('../controllers/ventas.controller');

router.get('/', (req, res) => {
});

router.post('/', ventasController.postVenta)

module.exports = router