const express = require('express')
const router = express.Router()
const salesController = require('../controllers/sales.controller');

router.post('/', salesController.postVenta)

router.get('/', salesController.getVentas)

module.exports = router