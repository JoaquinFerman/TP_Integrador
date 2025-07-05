const express = require('express')
const router = express.Router()
const salesController = require('../controllers/sales.controller');

router.post('/', salesController.postSale)

router.get('/', salesController.getSales)

module.exports = router