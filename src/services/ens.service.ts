import { createPublicClient, http, getAddress } from 'viem';
import { mainnet } from 'viem/chains';

const CACHE_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

type CacheEntry = {
  address: string;
  timestamp: number;
};

let addressCache: CacheEntry | null = null;

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function getYodlSigningAddress(): Promise<string> {
  // Return cached address if it's still valid
  if (addressCache && Date.now() - addressCache.timestamp < CACHE_DURATION) {
    return addressCache.address;
  }

  // Resolve ENS name
  const address = await publicClient.getEnsAddress({
    name: 'webhooks.yodl.eth',
  });

  if (!address) {
    throw new Error('Failed to resolve ENS name: webhooks.yodl.eth');
  }

  // Update cache
  addressCache = {
    address: getAddress(address), // Normalize address format
    timestamp: Date.now(),
  };

  return addressCache.address;
}
