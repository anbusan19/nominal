import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { arc } from './chains';
import { mainnet } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: [arc, mainnet], // mainnet for ENS resolution
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
    [mainnet.id]: http(),
  },
  ssr: true,
});
