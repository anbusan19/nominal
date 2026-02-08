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
    
    if (!treasuryWalletId) {
      return NextResponse.json(
        { error: 'TREASURY_WALLET_ID not configured' },
        { status: 500 }
      );
    }

    const balance = await client.getWalletTokenBalance({
      walletId: treasuryWalletId,
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

/**
 * POST /api/payout - Execute payroll payout
 * Body: { employeeAddress: string, amount: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeAddress, amount } = body;

    if (!employeeAddress || !amount) {
      return NextResponse.json(
        { error: 'employeeAddress and amount are required' },
        { status: 400 }
      );
    }

    const treasuryWalletId = process.env.TREASURY_WALLET_ID;
    const usdcTokenId = process.env.USDC_TOKEN_ID_ARC;

    if (!treasuryWalletId || !usdcTokenId) {
      return NextResponse.json(
        { error: 'TREASURY_WALLET_ID or USDC_TOKEN_ID_ARC not configured' },
        { status: 500 }
      );
    }

    // Create transaction for payout
    // Reference: https://developers.circle.com/wallets
    const response = await client.createTransaction({
      walletId: treasuryWalletId,
      tokenId: usdcTokenId,
      destinationAddress: employeeAddress,
      amounts: [amount], // Amount in smallest unit (6 decimals for USDC)
      feeLevel: 'MEDIUM' as const,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating payout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payout' },
      { status: 500 }
    );
  }
}

