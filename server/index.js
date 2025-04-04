const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const stripeRouter = require('./router/stripeRouter'); // Adjust the path as needed
const warehouseRouter = require('./router/warehouseRouter'); // Import the warehouse router
const db = require('./utils/db');

async function start() {
  try {
    // Initialize the database connection pool
    await db.initializeDB();
    
    // Start your Express server or other application code
    const app = express();

    app.use(express.json()); // Middleware to parse JSON bodies

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

    
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

// handle app shutdown by closing connections to oracle adw
process.on('SIGINT', async () => {
  try {
    await db.closePool();
    console.log('Application terminated gracefully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});