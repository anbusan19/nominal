import { defineChain } from 'viem';
import { sepolia } from 'viem/chains';

// Arc (Circle) Testnet Chain Configuration
export const arc = defineChain({
  id: Number(process.env.NEXT_PUBLIC_ARC_CHAIN_ID) || 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6, // USDC has 6 decimals on Arc
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arc Explorer',
      url: 'https://explorer.testnet.arc.network',
    },
  },
});

// USDC on Arc (native token)
export const ARC_USDC_ADDRESS = (process.env.NEXT_PUBLIC_ARC_USDC_ADDRESS || 
  '0x3600000000000000000000000000000000000000') as `0x${string}`;

// Export Sepolia for ENS operations
export { sepolia };
