const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware.js');
const stripeController = require('../controller/stripeController.js');

router.post('/savepayment', stripeController.savePaymentMethod);
router.post('/charge', stripeController.chargePayment);
router.post('/createCustomer', stripeController.createCustomer);
router.post('/createPayment',stripeController.createPaymentMethod)

module.exports = router;