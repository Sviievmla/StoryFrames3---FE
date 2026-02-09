# PayPal Checkout Integration

This project includes a lightweight Node.js/Express backend for PayPal checkout integration with the StoryFrames e-commerce frontend.

## Features

- PayPal Checkout (Card + PayPal payments)
- One-time payments
- Amount and currency passed from frontend (not hardcoded)
- Input validation and error handling
- CORS enabled for frontend-backend communication
- Free-tier friendly architecture

## Project Structure

```
.
├── index.html              # Frontend HTML
├── assets/                 # Frontend assets (CSS, JS, images)
├── server/                 # Backend API
│   ├── server.js          # Express server with PayPal endpoints
│   ├── package.json       # Server dependencies
│   └── .env.example       # Environment variables template
├── package.json           # Root package.json with scripts
└── README-PAYPAL.md       # This file
```

## Prerequisites

- Node.js (v14 or higher)
- PayPal Developer Account
- npm or yarn

## Setup Instructions

### 1. Get PayPal API Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in or create an account
3. Navigate to "Apps & Credentials"
4. Create a new app or use an existing one
5. Copy your **Client ID** and **Secret** for the Sandbox environment

### 2. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your PayPal credentials:

```
PAYPAL_CLIENT_ID=your_actual_client_id
PAYPAL_CLIENT_SECRET=your_actual_client_secret
PAYPAL_MODE=sandbox
PORT=3000
```

**Important:** Also update the PayPal Client ID in `index.html`:
- Open `index.html`
- Find the PayPal SDK script tag (around line 16)
- Replace `?client-id=test` with `?client-id=YOUR_CLIENT_ID`
- Example: `<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>`

### 3. Install Dependencies

```bash
# Install server dependencies
npm run install-server
```

### 4. Run Locally

#### Option 1: Start backend only
```bash
npm run start-server
```

The backend will run on `http://localhost:3000`

#### Option 2: Serve frontend with any static server

Using Python:
```bash
python -m http.server 8000
```

Or using Node.js http-server:
```bash
npx http-server . -p 8000
```

Then open `http://localhost:8000` in your browser.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Create Order
```
POST /api/orders/create
Content-Type: application/json

{
  "amount": "29.99",
  "currency": "USD"
}
```

**Validation Rules:**
- `amount`: Required, must be a positive number, max 999999.99
- `currency`: Required, must be one of: USD, EUR, GBP, CAD, AUD, JPY

**Response:**
```json
{
  "id": "ORDER_ID",
  "status": "CREATED",
  ...
}
```

### Capture Order
```
POST /api/orders/:orderID/capture
```

**Response:**
```json
{
  "id": "ORDER_ID",
  "status": "COMPLETED",
  ...
}
```

## Deployment to Render

### 1. Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `storyframes-backend` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your branch)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2. Set Environment Variables

In Render dashboard, go to "Environment" tab and add:

```
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox
PORT=3000
```

### 3. Deploy

Click "Create Web Service" and wait for deployment.

### 4. Update Frontend

After backend deployment, you need to update two things in your frontend:

1. **Update API URL** in `assets/js/paypal.js`:
   - Change `const API_BASE_URL = 'http://localhost:3000'` 
   - To `const API_BASE_URL = 'https://your-app-name.onrender.com'`

2. **Update PayPal Client ID** in `index.html`:
   - Find the PayPal SDK script tag
   - Replace `?client-id=test` with your actual PayPal Client ID
   - Example: `<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>`

### 5. Deploy Frontend

You can deploy the frontend to:
- **Render Static Site**: For the HTML/CSS/JS files
- **Netlify**: Drag and drop or connect GitHub
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Enable in repository settings

## Testing

### Test with Sandbox Credentials

PayPal provides test accounts for sandbox testing:
- Go to [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
- Use the test buyer account to complete purchases
- No real money is charged in sandbox mode

### Test Card Numbers (Sandbox)

Use these test cards in sandbox mode:
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **Amex**: 378282246310005

## Production Deployment

To use real payments:

1. Update `PAYPAL_MODE=live` in your environment variables
2. Use your **Live** PayPal credentials (not sandbox)
3. Ensure your PayPal account is fully verified and approved for live transactions

## Troubleshooting

### CORS Errors
- Ensure the backend has CORS enabled (already configured)
- Check that frontend is making requests to the correct backend URL

### PayPal API Errors
- Verify your Client ID and Secret are correct
- Ensure you're using the right mode (sandbox vs live)
- Check PayPal API logs in developer dashboard

### Port Already in Use
```bash
# Change PORT in .env file or kill the process
kill -9 $(lsof -ti:3000)
```

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Validate all inputs on the backend
- Use HTTPS in production
- Keep dependencies updated

## Support

For issues or questions:
- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal Support: https://developer.paypal.com/support/

## License

ISC
