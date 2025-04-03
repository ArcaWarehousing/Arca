const express = require('express');
const router = express.Router();
const stripeController = require('../controller/stripeController.js');

// Define the handleWebhook function directly on the router
router.handleWebhook = stripeController.handleWebhook;

// Define other routes
router.post('/create-checkout-session', stripeController.createCheckoutSession);
router.get('/retrieve-checkout-session/:sessionId', stripeController.retrieveCheckoutSession);
router.post('/handleWebhook', stripeController.handleWebhook);

module.exports = router;