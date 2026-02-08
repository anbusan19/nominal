import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

// Initialize Circle client
const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

/**
 * POST /api/payout/batch - Execute batch payroll payout
 * Body: { payouts: Array<{ employeeAddress: string, amount: string }> }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payouts } = body;

    if (!Array.isArray(payouts) || payouts.length === 0) {
      return NextResponse.json(
        { error: 'payouts must be a non-empty array' },
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

    // Execute batch payouts
    // Note: Circle API may require individual transactions or a batch endpoint
    // Check Circle docs for batch transaction support
    const results = await Promise.allSettled(
      payouts.map((payout: { employeeAddress: string; amount: string }) =>
        client.createTransaction({
          walletId: treasuryWalletId,
          tokenId: usdcTokenId,
          destinationAddress: payout.employeeAddress,
          amounts: [payout.amount],
          feeLevel: 'MEDIUM' as const,
        })
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    return NextResponse.json({
      success: successful.length,
      failed: failed.length,
      results: results.map((r, i) => ({
        index: i,
        status: r.status,
        data: r.status === 'fulfilled' ? r.value.data : null,
        error: r.status === 'rejected' ? r.reason : null,
      })),
    });
  } catch (error: any) {
    console.error('Error creating batch payout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create batch payout' },
      { status: 500 }
    );
  }
}
