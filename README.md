# Responsive Ecommerce Website with PayPal Payments
## [Watch it on youtube](https://youtu.be/74UVy9gomVs)
### Responsive Ecommerce Website

- Responsive Ecommerce Website Using HTML CSS JavaScript
- Contains smooth scrolling in each section.
- Developed first with the Mobile First methodology, then for desktop.
- Compatible with all mobile devices and with a beautiful and pleasant user interface.
- **NEW:** Integrated PayPal payment processing with Express backend

💙 Join the channel to see more videos like this. [Bedimcode](https://www.youtube.com/@Bedimcode)

![preview img](/preview.png)

## 🚀 Features

- ✅ Responsive design for mobile and desktop
- ✅ PayPal payment integration (card + PayPal account)
- ✅ Express backend for secure payment processing
- ✅ Multiple currency support (USD, EUR, GBP, CAD, AUD, JPY)
- ✅ Server-side input validation
- ✅ Ready for Render deployment

## 📋 Prerequisites

- Node.js 14.x or higher
- PayPal Developer Account ([Sign up here](https://developer.paypal.com/))
- Web browser with JavaScript enabled

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Sviievmla/StoryFrames3---FE.git
cd StoryFrames3---FE
```

### 2. Setup Backend Server

#### Get PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a new app or use an existing one
3. Copy your **Client ID** and **Secret** from the app credentials

#### Install Dependencies

```bash
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your PayPal credentials:

```env
PAYPAL_CLIENT_ID=your_actual_client_id
PAYPAL_CLIENT_SECRET=your_actual_client_secret
PAYPAL_MODE=sandbox
PORT=3000
FRONTEND_URL=http://localhost:8080
```

#### Start the Backend Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Setup Frontend

#### Update PayPal Client ID

Edit `index.html` and replace `YOUR_PAYPAL_CLIENT_ID` with your actual PayPal Client ID:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
```

#### Configure API URL

The frontend is configured to use `http://localhost:3000` by default for local development.

For production, update the `API_URL` in `index.html`:

```javascript
const API_URL = 'https://your-backend-service.onrender.com';
```

#### Serve the Frontend

You can use any static file server. For example:

```bash
# Using Python
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

Open your browser and navigate to `http://localhost:8080`

### 4. Test the Payment Flow

1. Scroll to the **Checkout** section
2. Enter an amount and select a currency
3. Click on the PayPal button
4. Use PayPal sandbox test credentials to complete the payment
5. Check the browser console and server logs for transaction details

## 🌐 Deploying to Render

### Deploy Backend

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: storyframes-payment-backend
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_MODE` (sandbox or live)
   - `FRONTEND_URL` (your frontend URL)
6. Click "Create Web Service"

### Deploy Frontend

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: storyframes-frontend
   - **Root Directory**: leave empty (root)
   - **Build Command**: leave empty
   - **Publish Directory**: `.`
4. Update `index.html` with your backend URL:
   ```javascript
   const API_URL = 'https://your-backend-service.onrender.com';
   ```
5. Update PayPal script with your Client ID
6. Click "Create Static Site"

## 🧪 Testing with PayPal Sandbox

PayPal provides test accounts for sandbox testing:

1. Go to [PayPal Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
2. Create or use existing test accounts
3. Use test credentials to complete payments

**Example Test Account:**
- Email: sb-buyer@personal.example.com
- Password: (provided by PayPal)

## 📚 API Documentation

The backend server exposes the following endpoints:

### Health Check
```
GET /health
```

### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "amount": "29.99",
  "currency": "USD"
}
```

### Capture Order
```
POST /api/orders/:orderID/capture
```

For detailed API documentation, see [server/README.md](server/README.md)

## 🔒 Security

- ✅ Environment variables for sensitive credentials
- ✅ Server-side input validation
- ✅ CORS configuration
- ✅ PayPal SDK for secure transactions
- ⚠️ Never commit `.env` files with real credentials
- ⚠️ Always use sandbox mode for testing

## 📝 Environment Variables

### Backend (`server/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PAYPAL_CLIENT_ID` | PayPal API Client ID | Yes | - |
| `PAYPAL_CLIENT_SECRET` | PayPal API Client Secret | Yes | - |
| `PAYPAL_MODE` | Environment mode (sandbox/live) | No | sandbox |
| `PORT` | Server port | No | 3000 |
| `FRONTEND_URL` | Frontend URL for CORS | No | * |

## 🛠️ Project Structure

```
StoryFrames3---FE/
├── assets/
│   ├── css/
│   │   └── styles.css          # Includes checkout styles
│   ├── js/
│   │   ├── main.js             # Original JS
│   │   └── payment.js          # PayPal integration
│   └── img/
├── server/
│   ├── .env.example            # Environment template
│   ├── .gitignore              # Server gitignore
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Express server
│   ├── paypal-client.js        # PayPal SDK config
│   └── README.md               # Server documentation
├── index.html                  # Main HTML with checkout section
└── README.md                   # This file
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify `.env` file exists with valid credentials
- Run `npm install` in server directory

### CORS errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for specific CORS errors

### PayPal button not showing
- Verify PayPal Client ID in `index.html`
- Check browser console for JavaScript errors
- Ensure backend server is running

### Payment fails
- Check server logs for detailed errors
- Verify PayPal credentials are correct
- Ensure you're using test accounts in sandbox mode

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
- Check [server/README.md](server/README.md) for backend-specific issues
- Review [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- Open an issue on GitHub
