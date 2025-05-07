import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: MAINNET_RPC_URL ? http(MAINNET_RPC_URL) : http(),
});
