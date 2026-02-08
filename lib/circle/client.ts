import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

/**
 * Initialize Circle Developer Controlled Wallets client
 * Reference: https://developers.circle.com/wallets
 */
export function getCircleClient() {
  const apiKey = process.env.CIRCLE_API_KEY;
  const entitySecret = process.env.CIRCLE_ENTITY_SECRET;

  if (!apiKey || !entitySecret) {
    throw new Error('CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET must be set');
  }

  return initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });
}

/**
 * Get treasury wallet balance
 */
export async function getTreasuryBalance(walletId: string) {
  const client = getCircleClient();
  return client.getWalletTokenBalance({ id: walletId });
}

/**
 * Create a payout transaction
 */
export async function createPayout(params: {
  walletId: string;
  tokenId: string;
  destinationAddress: string;
  amount: string;
  feeLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}) {
  const client = getCircleClient();
  return client.createTransaction({
    walletId: params.walletId,
    tokenId: params.tokenId,
    destinationAddress: params.destinationAddress,
    amount: [params.amount],
          fee: {
            type: 'level',
            config: {
              feeLevel: 'MEDIUM',
            },
          },
  });
}
