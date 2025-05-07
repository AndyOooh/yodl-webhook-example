import { getYodlSigningAddress } from '../services/ens.service';

async function testEnsResolution() {
  console.log('Testing ENS resolution for webhooks.yodl.eth...');

  try {
    // First call - should resolve from ENS
    console.log('\nFirst call - should resolve from ENS:');
    const address1 = await getYodlSigningAddress();
    console.log('Resolved address:', address1);

    // Second call - should use cache
    console.log('\nSecond call - should use cache:');
    const address2 = await getYodlSigningAddress();
    console.log('Cached address:', address2);

    // Verify addresses match
    if (address1 === address2) {
      console.log('\n✅ Cache is working correctly - addresses match');
    } else {
      console.log('\n❌ Cache is not working - addresses differ');
    }

    // Verify address format
    if (address1.startsWith('0x') && address1.length === 42) {
      console.log('✅ Address format is correct');
    } else {
      console.log('❌ Address format is incorrect');
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Run the test
testEnsResolution();
