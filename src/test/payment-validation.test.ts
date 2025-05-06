// Test data - you can modify these values
const TEST_DATA = {
  txHash: '0x9422111abfc86ac0896abca1bfcec2d9c38d7765d0d24efb0b7d00ce389e279b',
  chainId: 8453,
  paymentIndex: 0,
  acceptedTokens: ['USDC', 'USDT'],
  expectedAmount: 0.01, // 1 USDC (6 decimals)
};

// Function to test payment validation endpoint
async function testPaymentValidation(data: typeof TEST_DATA) {
  try {
    const response = await fetch('http://localhost:3000/api/validate-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('Validation Response:', result);
    return result;
  } catch (error) {
    console.error('Error testing payment validation:', error);
    throw error;
  }
}

// Test cases
async function runTests() {
  console.log('Running payment validation tests...');

  // Test 1: Valid payment
  console.log('\nTest 1: Valid payment');
  await testPaymentValidation(TEST_DATA);

  // Test 2: Invalid token
  console.log('\nTest 2: Invalid token');
  await testPaymentValidation({
    ...TEST_DATA,
    acceptedTokens: ['DAI'], // Token not in payment
  });

  // Test 3: Insufficient amount
  console.log('\nTest 3: Insufficient amount');
  await testPaymentValidation({
    ...TEST_DATA,
    expectedAmount: 2000000, // Expecting more than paid
  });

  // Test 4: Missing required fields
  console.log('\nTest 4: Missing required fields');
  await testPaymentValidation({
    txHash: TEST_DATA.txHash,
    // Missing other required fields
  } as any);
}

// Run all tests
runTests()
  .then(() => console.log('\nAll tests completed'))
  .catch(console.error);
