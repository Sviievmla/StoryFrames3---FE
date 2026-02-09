const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
const PAYPAL_API_BASE = PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

/**
 * Get PayPal OAuth token
 */
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error_description || data.error}`);
  }
  
  return data.access_token;
}

/**
 * Validate amount and currency
 */
function validatePaymentData(amount, currency) {
  const errors = [];
  
  // Validate amount
  if (!amount) {
    errors.push('Amount is required');
  } else {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.push('Amount must be a positive number');
    }
    if (numAmount > 999999.99) {
      errors.push('Amount exceeds maximum limit');
    }
  }
  
  // Validate currency
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
  if (!currency) {
    errors.push('Currency is required');
  } else if (!validCurrencies.includes(currency.toUpperCase())) {
    errors.push(`Currency must be one of: ${validCurrencies.join(', ')}`);
  }
  
  return errors;
}

/**
 * Create PayPal Order
 * POST /api/orders/create
 * Body: { amount: string, currency: string }
 */
app.post('/api/orders/create', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    // Validate input
    const validationErrors = validatePaymentData(amount, currency);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Get access token
    const accessToken = await getPayPalAccessToken();
    
    // Create order
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency.toUpperCase(),
            value: parseFloat(amount).toFixed(2)
          }
        }]
      })
    });

    const orderData = await response.json();
    
    if (!response.ok) {
      console.error('PayPal API Error:', orderData);
      return res.status(response.status).json({
        error: 'Failed to create PayPal order',
        details: orderData.message || orderData.details
      });
    }

    res.json(orderData);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
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
        error: 'Order ID is required'
      });
    }

    // Get access token
    const accessToken = await getPayPalAccessToken();
    
    // Capture order
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const captureData = await response.json();
    
    if (!response.ok) {
      console.error('PayPal Capture Error:', captureData);
      return res.status(response.status).json({
        error: 'Failed to capture PayPal order',
        details: captureData.message || captureData.details
      });
    }

    res.json(captureData);
  } catch (error) {
    console.error('Error capturing order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PayPal Mode: ${PAYPAL_MODE}`);
  console.log('Endpoints:');
  console.log(`  - GET  /api/health`);
  console.log(`  - POST /api/orders/create`);
  console.log(`  - POST /api/orders/:orderID/capture`);
});
