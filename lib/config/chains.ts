import { defineChain } from 'viem';

// Arc (Circle) L1 Chain Configuration
export const arc = defineChain({
  id: Number(process.env.NEXT_PUBLIC_ARC_CHAIN_ID) || 12345,
  name: 'Arc',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.arc.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arc Explorer',
      url: 'https://explorer.arc.xyz',
    },
  },
});

// USDC on Arc (update with actual address)
export const USDC_ADDRESS = '0x...' as const;
