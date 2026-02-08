import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { arc, sepolia } from './chains';
import { mainnet } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: [arc, sepolia, mainnet], // sepolia for ENS NameWrapper, mainnet for ENS resolution
  connectors: [
    injected(),
    ...(process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
          }),
        ]
      : []),
  ],
  transports: {
    [arc.id]: http(process.env.NEXT_PUBLIC_ARC_RPC_URL),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});
