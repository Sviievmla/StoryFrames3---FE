/**
 * PayPal Payment Integration
 * Handles payment flow with backend API
 */

// Check if PayPal SDK is loaded
if (typeof paypal !== 'undefined') {
    initPayPalButton();
} else {
    console.error('PayPal SDK not loaded. Please check your client ID in index.html');
    showMessage('PayPal SDK not loaded. Please contact support.', 'error');
}

function initPayPalButton() {
    paypal.Buttons({
        // Create order on backend
        createOrder: async function(data, actions) {
            try {
                const amount = document.getElementById('amount').value;
                const currency = document.getElementById('currency').value;

                // Validate input
                if (!amount || parseFloat(amount) <= 0) {
                    showMessage('Please enter a valid amount', 'error');
                    throw new Error('Invalid amount');
                }

                showMessage('Creating order...', 'info');

                // Call backend to create order
                const response = await fetch(`${API_URL}/api/orders`, {
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
                    throw new Error(orderData.error || 'Failed to create order');
                }

                showMessage('Order created successfully', 'success');
                return orderData.orderID;

            } catch (error) {
                console.error('Error creating order:', error);
                showMessage(`Error: ${error.message}`, 'error');
                throw error;
            }
        },

        // Capture payment on backend
        onApprove: async function(data, actions) {
            try {
                showMessage('Processing payment...', 'info');

                // Call backend to capture payment
                const response = await fetch(`${API_URL}/api/orders/${data.orderID}/capture`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const captureData = await response.json();

                if (!response.ok) {
                    throw new Error(captureData.error || 'Failed to capture payment');
                }

                // Payment successful
                showMessage(
                    `Payment successful! Transaction ID: ${captureData.captureID}`,
                    'success'
                );

                console.log('Payment captured:', captureData);

                // You can redirect to a success page or update UI here
                // window.location.href = '/success.html';

            } catch (error) {
                console.error('Error capturing payment:', error);
                showMessage(`Payment failed: ${error.message}`, 'error');
            }
        },

        // Handle errors
        onError: function(err) {
            console.error('PayPal error:', err);
            showMessage('An error occurred with PayPal. Please try again.', 'error');
        },

        // Handle cancellation
        onCancel: function(data) {
            console.log('Payment cancelled:', data);
            showMessage('Payment cancelled', 'warning');
        }

    }).render('#paypal-button-container');
}

// Helper function to show messages
function showMessage(message, type = 'info') {
    const messageElement = document.getElementById('payment-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `payment-message payment-message--${type}`;
        
        // Auto-hide success/info messages after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'payment-message';
            }, 5000);
        }
    }
}
