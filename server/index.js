const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const stripeRouter = require('./router/stripeRouter'); // Adjust the path as needed
const warehouseRouter = require('./router/warehouseRouter'); // Import the warehouse router
const { corsMiddleware } = require('./middleware');

app.use(express.json()); // Middleware to parse JSON bodies

app.use(corsMiddleware);

// Use the stripe router for routes starting with /api
app.use('/api', stripeRouter);

// Use the warehouse router for routes starting with /warehouses
app.use('/warehouses', warehouseRouter);

// Webhook endpoint for Stripe
app.post('/webhook', express.raw({ type: 'application/json' }), stripeRouter.handleWebhook); // Webhook endpoint

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});