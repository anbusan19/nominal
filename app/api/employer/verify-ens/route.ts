import { NextRequest, NextResponse } from 'next/server'
import { checkENSOwnership, getENSOwner, normalizeENSName } from '@/lib/ens/utils'
import { Address } from 'viem'
import { ENS_CHAIN_ID } from '@/lib/config/constants'

interface VerifyRequest {
  domain: string
  address: Address
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json()
    const { domain, address } = body

    if (!domain || !address) {
      return NextResponse.json(
        { error: 'Missing required fields: domain, address' },
        { status: 400 }
      )
    }

    // Normalize the domain
    const normalized = normalizeENSName(domain)

    // Check ownership on mainnet (for .eth domains)
    const isOwner = await checkENSOwnership(normalized, address, 1) // Mainnet
    
    // Also check on Sepolia if it's a test domain
    let isOwnerSepolia = false
    try {
      isOwnerSepolia = await checkENSOwnership(normalized, address, ENS_CHAIN_ID)
    } catch (error) {
      // Ignore errors for Sepolia check
    }

    // Get the actual owner
    const owner = await getENSOwner(normalized, 1)
    const ownerSepolia = await getENSOwner(normalized, ENS_CHAIN_ID)

    return NextResponse.json({
      success: true,
      domain: normalized,
      isOwner: isOwner || isOwnerSepolia,
      owner: owner || ownerSepolia || null,
      chain: isOwner ? 'mainnet' : isOwnerSepolia ? 'sepolia' : 'none',
    })
  } catch (error: any) {
    console.error('Error verifying ENS ownership:', error)
    return NextResponse.json(
      { 
        error: 'Failed to verify ENS ownership',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
