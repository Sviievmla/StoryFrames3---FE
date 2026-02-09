/**
 * PayPal Client Configuration
 * Sets up the PayPal SDK with credentials from environment variables
 */

const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs.
 */
function client() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  // Validate required credentials
  if (!clientId || !clientSecret) {
    throw new Error(
      'PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.'
    );
  }
  
  const environment = process.env.PAYPAL_MODE === 'live' 
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
    
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
}

module.exports = { client };
