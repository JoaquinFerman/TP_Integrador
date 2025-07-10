const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')

router.get('/', adminController.getUserHomePage);

router.get('/usuarios', adminController.getUserPage);

router.get('/productos/:category', adminController.getProductsPage);

router.get('/ventas', adminController.getSalesPage)

module.exports = router
