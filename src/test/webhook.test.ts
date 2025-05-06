import 'dotenv/config';
import { signMessage } from 'viem/accounts';
import { Hex } from 'viem';

// Test data - you can modify these values
const TEST_DATA = {
  txHash: '0x9422111abfc86ac0896abca1bfcec2d9c38d7765d0d24efb0b7d00ce389e279b', // Replace with actual transaction hash
  chainId: 8453, // Replace with actual chain ID
  paymentIndex: 0, // Replace with actual payment index
};

// Function to generate signature for webhook
async function generateWebhookSignature(data: typeof TEST_DATA) {
  const message = JSON.stringify(data);
  const signature = await signMessage({
    message,
    privateKey: process.env.YODL_SIGNING_KEY as Hex,
  });
  return signature;
}

// Function to test webhook endpoint
async function testWebhookEndpoint() {
  try {
    const signature = await generateWebhookSignature(TEST_DATA);

    const response = await fetch('http://localhost:3000/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-yodl-signature': signature,
      },
      body: JSON.stringify(TEST_DATA),
    });

    const result = await response.json();
    console.log('Webhook Response:', result);
    return result;
  } catch (error) {
    console.error('Error testing webhook:', error);
    throw error;
  }
}

// Example usage
testWebhookEndpoint()
  .then(() => console.log('Test completed'))
  .catch(console.error);
