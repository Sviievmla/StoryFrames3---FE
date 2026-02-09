# PayPal Payment Backend Server

A lightweight Node.js + Express backend for handling PayPal payments with card and PayPal account support.

## Features

- ✅ Create PayPal orders
- ✅ Capture payments
- ✅ Server-side input validation
- ✅ CORS configuration for frontend integration
- ✅ Environment-based configuration
- ✅ Ready for Render deployment

## Prerequisites

- Node.js 14.x or higher
- PayPal Developer Account
- PayPal API credentials (Client ID and Secret)

## Getting Started

### 1. Get PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a new app or use an existing one
3. Copy your Client ID and Secret from the app credentials

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

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

### 4. Run Locally

```bash
npm start
```

The server will start on `http://localhost:3000`

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

## API Endpoints

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

Response:
```json
{
  "orderID": "7XY12345ABC67890",
  "status": "CREATED"
}
```

### Capture Order
```
POST /api/orders/:orderID/capture
```

Response:
```json
{
  "orderID": "7XY12345ABC67890",
  "status": "COMPLETED",
  "payerEmail": "customer@example.com",
  "captureID": "3AB98765CDE43210"
}
```

## Deploying to Render

### Step 1: Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure Build Settings

- **Name**: storyframes-payment-backend (or your preferred name)
- **Root Directory**: `server`
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 3: Add Environment Variables

In Render dashboard, add the following environment variables:

- `PAYPAL_CLIENT_ID`: Your PayPal Client ID
- `PAYPAL_CLIENT_SECRET`: Your PayPal Client Secret
- `PAYPAL_MODE`: `sandbox` or `live`
- `FRONTEND_URL`: Your frontend URL (e.g., `https://yourdomain.com`)

### Step 4: Deploy

Click "Create Web Service" and Render will automatically deploy your backend.

### Step 5: Update Frontend

Update your frontend's API endpoint URL to point to your Render service URL:
```
https://your-backend-service.onrender.com
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PAYPAL_CLIENT_ID` | PayPal API Client ID | Yes | - |
| `PAYPAL_CLIENT_SECRET` | PayPal API Client Secret | Yes | - |
| `PAYPAL_MODE` | Environment mode (`sandbox` or `live`) | No | `sandbox` |
| `PORT` | Server port | No | `3000` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `*` |

## Security Notes

- ⚠️ Never commit `.env` file with actual credentials
- ⚠️ Always use environment variables for sensitive data
- ⚠️ Use `sandbox` mode for testing
- ⚠️ Switch to `live` mode only for production
- ⚠️ Validate all inputs server-side
- ⚠️ Configure CORS properly for production

## Supported Currencies

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)

## Troubleshooting

### Port already in use
Change the PORT in `.env` file:
```env
PORT=3001
```

### CORS errors
Make sure `FRONTEND_URL` matches your frontend's domain.

### PayPal API errors
- Verify your credentials in `.env`
- Check if you're using the correct mode (sandbox/live)
- Ensure your PayPal app has the required permissions

## License

MIT
