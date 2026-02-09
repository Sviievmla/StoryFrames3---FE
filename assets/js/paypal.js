// PayPal Checkout Integration
// Configure your backend API URL
// For local development: http://localhost:3000
// For production: https://your-app-name.onrender.com (use HTTPS)
const API_BASE_URL = 'http://localhost:3000'; // Change this to your production URL

// Show message to user
function showMessage(message, isError = false) {
  const messageDiv = document.getElementById('checkout-message');
  messageDiv.textContent = message;
  messageDiv.style.color = isError ? '#dc3545' : '#28a745';
  messageDiv.style.padding = '10px';
  messageDiv.style.marginTop = '10px';
  messageDiv.style.borderRadius = '4px';
  messageDiv.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
}

// Initialize PayPal button when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get PayPal client ID from your PayPal developer account
  // For production, replace the SDK script src in index.html with your actual client ID
  
  if (typeof paypal === 'undefined') {
    console.error('PayPal SDK not loaded');
    showMessage('PayPal SDK failed to load. Please refresh the page.', true);
    return;
  }

  paypal.Buttons({
    // Set up the transaction
    createOrder: async function(data, actions) {
      try {
        const amount = document.getElementById('amount').value;
        const currency = document.getElementById('currency').value;

        // Validate amount
        if (!amount || parseFloat(amount) <= 0) {
          showMessage('Please enter a valid amount', true);
          throw new Error('Invalid amount');
        }

        showMessage('Creating order...');

        // Call backend to create order
        const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: amount,
            currency: currency
          })
        });

        const orderData = await response.json();

        if (!response.ok) {
          console.error('Error creating order:', orderData);
          showMessage(orderData.error || 'Failed to create order', true);
          throw new Error(orderData.error || 'Failed to create order');
        }

        showMessage('Order created successfully. Please complete payment.');
        return orderData.id;
      } catch (error) {
        console.error('Error in createOrder:', error);
        showMessage('Error creating order: ' + error.message, true);
        throw error;
      }
    },

    // Capture the funds from the transaction
    onApprove: async function(data, actions) {
      try {
        showMessage('Processing payment...');

        // Call backend to capture order
        const response = await fetch(`${API_BASE_URL}/api/orders/${data.orderID}/capture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const captureData = await response.json();

        if (!response.ok) {
          console.error('Error capturing order:', captureData);
          showMessage(captureData.error || 'Failed to capture payment', true);
          throw new Error(captureData.error || 'Failed to capture payment');
        }

        // Show success message
        const transaction = captureData.purchase_units[0].payments.captures[0];
        showMessage(`Payment successful! Transaction ID: ${transaction.id}`, false);
        
        console.log('Capture result:', captureData);
        
        // Here you can add additional logic like:
        // - Updating order status in your database
        // - Sending confirmation email
        // - Redirecting to a success page
        
      } catch (error) {
        console.error('Error in onApprove:', error);
        showMessage('Error processing payment: ' + error.message, true);
      }
    },

    // Handle cancellation
    onCancel: function(data) {
      console.log('Payment cancelled', data);
      showMessage('Payment was cancelled', true);
    },

    // Handle errors
    onError: function(err) {
      console.error('PayPal error:', err);
      showMessage('An error occurred with PayPal. Please try again.', true);
    },

    // Styling
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal'
    }
  }).render('#paypal-button-container');

  console.log('PayPal button initialized');
});
