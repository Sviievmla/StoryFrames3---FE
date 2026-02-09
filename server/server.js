/**
 * Express Server for PayPal Payment Processing
 * Provides endpoints for creating and capturing PayPal orders
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { client } = require('./paypal-client');
const { SUPPORTED_CURRENCIES } = require('./config');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PayPal payment server is running' });
});

/**
 * Create PayPal Order
 * POST /api/orders
 * Body: { amount: number, currency: string }
 */
app.post('/api/orders', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Validate inputs
    if (!amount || !currency) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount and currency are required' 
      });
    }

    // Validate amount is a positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount: must be a positive number' 
      });
    }

    // Validate currency code (ISO 4217)
    if (!SUPPORTED_CURRENCIES.includes(currency.toUpperCase())) {
      return res.status(400).json({ 
        error: `Invalid currency: must be one of ${SUPPORTED_CURRENCIES.join(', ')}` 
      });
    }

    // Create order request
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency.toUpperCase(),
          value: parsedAmount.toFixed(2)
        }
      }]
    });

    // Execute request
    const order = await client().execute(request);

    res.json({
      orderID: order.result.id,
      status: order.result.status
    });

  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to create PayPal order',
      details: error.message 
    });
  }
});

/**
 * Capture PayPal Order
 * POST /api/orders/:orderID/capture
 */
app.post('/api/orders/:orderID/capture', async (req, res) => {
  try {
    const { orderID } = req.params;

    if (!orderID) {
      return res.status(400).json({ 
        error: 'Missing orderID parameter' 
      });
    }

    // Capture order request
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    // Execute request
    const capture = await client().execute(request);

    res.json({
      orderID: capture.result.id,
      status: capture.result.status,
      payerEmail: capture.result.payer?.email_address,
      captureID: capture.result.purchase_units[0]?.payments?.captures[0]?.id
    });

  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to capture PayPal order',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PayPal payment server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`PayPal Mode: ${process.env.PAYPAL_MODE || 'sandbox'}`);
});
