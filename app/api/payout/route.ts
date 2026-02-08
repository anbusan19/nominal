import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

// Initialize Circle client
const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

/**
 * GET /api/payout - Get treasury balance
 */
export async function GET() {
  try {
    const treasuryWalletId = process.env.TREASURY_WALLET_ID;
    const usdcTokenId = process.env.USDC_TOKEN_ID_ARC;

    if (!treasuryWalletId || !usdcTokenId) {
      return NextResponse.json(
        { error: 'TREASURY_WALLET_ID or USDC_TOKEN_ID_ARC not configured' },
        { status: 500 }
      );
    }

    const balance = await client.getWalletTokenBalance({
      id: treasuryWalletId,
    });

    return NextResponse.json(balance);
  } catch (error: any) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
