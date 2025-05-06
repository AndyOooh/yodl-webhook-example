# Yodl Webhooks Example

This repository serves as a template for Yodl mini-app (yapp) builders to implement webhook verification and payment validation. It demonstrates how to securely receive webhooks from Yodl and validate payments using the Yodl indexer API.

## Features

- 🔐 Webhook signature verification
- 💰 Payment validation against expected parameters
- 🛡️ Type-safe Express.js implementation

## Prerequisites

- Node.js 20+
- Yodl signing address (provided on request by Yodl team)

## Environment Variables

Rename the `.env.example` file to `.env`.
Replace `YODL_SIGNING_ADDRESS` with the values provided by Yodl.
`YODL_SIGNING_KEY` is only use for running test scripts locally.

## Install dependencies

```bash
yarn
```

## Run development server

```bash
yarn dev
```

## Run production server

```bash
yarn start
```

## API Endpoints

### 1. Webhook Verification

```http
POST /api/webhook
```

Receives and verifies webhooks from Yodl. The webhook payload includes:

- `txHash`: Transaction hash
- `chainId`: Chain ID
- `paymentIndex`: Index of the payment in the transaction

**Headers:**

- `x-yodl-signature`: Signature of the webhook payload

### 2. Payment Validation

```http
POST /api/validate-payment
```

Validates a payment against expected parameters.

**Request Body:**

```json
{
  "txHash": "0x...",
  "paymentIndex": 0,
  "acceptedTokens": ["USDC", "USDT"],
  "expectedAmount": 1000000
}
```

## Usage Example

1. **Receiving Webhooks**

When Yodl sends a webhook to your endpoint, it will include a signature in the `x-yodl-signature` header. The template automatically verifies this signature against your Yodl signing address.

2. **Validating Payments**

After receiving a webhook, you can validate the payment using the validate-payment endpoint:

```typescript
const response = await fetch('/api/validate-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    txHash: '0x...',
    paymentIndex: 0,
    acceptedTokens: ['USDC'],
    expectedAmount: 1000000,
  }),
});
```

## Security Considerations

1. Always verify webhook signatures using the provided `x-yodl-signature` header
2. Store your Yodl signing address securely in environment variables
3. Validate all payment parameters before processing
4. Use HTTPS in production

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
