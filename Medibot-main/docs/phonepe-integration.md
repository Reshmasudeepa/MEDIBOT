# PhonePe Payment Integration for MediBot

This document explains the updated PhonePe payment integration using the official PhonePe PG SDK Node.js library.

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# PhonePe Payment Gateway Configuration
PHONEPE_CLIENT_ID=your_phonepe_client_id
PHONEPE_CLIENT_SECRET=your_phonepe_client_secret

# Firebase Admin (for server-side operations)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id",...}

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=development
```

### 2. PhonePe Account Setup

1. Sign up for a PhonePe merchant account
2. Get your Client ID and Client Secret from the PhonePe merchant dashboard
3. Configure webhook URLs in your PhonePe dashboard:
   - Callback URL: `https://your-domain.com/api/phonepe-callback`
   - Status Check URL: `https://your-domain.com/api/phonepe-status`

### 3. Firebase Setup

1. Create a Firebase service account key
2. Download the service account JSON file
3. Convert it to a single-line JSON string and add to `FIREBASE_SERVICE_ACCOUNT_KEY`

## API Endpoints

### 1. `/api/phonepe-payment` (POST)

Initiates a payment with PhonePe.

**Request Body:**
```json
{
  "amount": 99,
  "userId": "user_id",
  "planName": "Premium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://phonepe.com/payment/...",
    "merchantTransactionId": "MEDIBOT-PREMIUM-xxx"
  },
  "message": "Payment initiated successfully"
}
```

### 2. `/api/phonepe-callback` (GET)

Handles payment completion redirects from PhonePe.

**Query Parameters:**
- `merchantTransactionId`: Transaction ID
- `planName`: Subscription plan name
- `userId`: User ID
- `code`: PhonePe status code
- `transactionId`: PhonePe transaction ID

### 3. `/api/phonepe-status` (POST/GET)

Checks payment status with PhonePe.

**POST Request Body:**
```json
{
  "transactionId": "MEDIBOT-PREMIUM-xxx"
}
```

**GET Query Parameters:**
- `merchantTransactionId`: Transaction ID to check

## Database Schema

### Payments Collection (`payments`)

```javascript
{
  userId: "string",
  planName: "string", // "Premium" or "Pro"
  amount: "number", // Amount in rupees
  amountInPaise: "number", // Amount in paise
  merchantTransactionId: "string",
  status: "string", // "pending_payment_gateway", "completed", "failed"
  createdAt: "timestamp",
  updatedAt: "timestamp",
  phonepeTransactionId: "string",
  responseCode: "string",
  phonepeResponse: "object",
  paymentHistory: [
    {
      at: "string",
      action: "string",
      note: "string"
    }
  ]
}
```

### Users Collection (`users`)

```javascript
{
  subscription: {
    plan: "string", // "premium" or "pro"
    status: "string", // "active", "inactive"
    startDate: "timestamp",
    endDate: "timestamp",
    lastPaymentId: "string"
  },
  updatedAt: "timestamp"
}
```

## Payment Flow

1. User clicks "Pay with PhonePe" on pricing page
2. Frontend calls `/api/phonepe-payment` with plan details
3. Backend creates payment record in Firestore
4. Backend initiates payment with PhonePe SDK
5. User is redirected to PhonePe payment page
6. After payment completion, PhonePe redirects to `/api/phonepe-callback`
7. Callback updates payment status and user subscription
8. User is redirected to pricing page with status message

## Testing

For testing in sandbox mode:
1. Set `NODE_ENV=development`
2. Use PhonePe sandbox credentials
3. Use test payment methods provided by PhonePe

## Security Notes

- All sensitive credentials are stored in environment variables
- Payment verification is handled by PhonePe SDK
- Transaction logs are maintained in Firestore
- User subscriptions are updated only after successful payment verification

## Troubleshooting

### Common Issues

1. **PhonePe client not initialized**
   - Check if `PHONEPE_CLIENT_ID` and `PHONEPE_CLIENT_SECRET` are set correctly

2. **Firebase errors**
   - Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is properly formatted JSON
   - Check Firebase project ID and permissions

3. **Redirect URL issues**
   - Ensure `NEXT_PUBLIC_BASE_URL` matches your actual domain
   - Verify callback URLs are configured in PhonePe dashboard

### Logs

Check the console logs for detailed error messages:
- Payment initiation logs: `[PhonePe] Incoming request body`
- Callback logs: `[PhonePe Callback] GET params`
- Status check logs: `Status check error`
