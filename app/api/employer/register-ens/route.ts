import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, Address, namehash, encodeFunctionData, parseAbi } from 'viem'
import { sepolia, mainnet } from 'viem/chains'
import { ENS_NAME_WRAPPER_ADDRESS, ENS_CHAIN_ID } from '@/lib/config/constants'
import { normalizeENSName } from '@/lib/ens/utils'

/**
 * Simple ENS name normalization
 */
function normalize(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid ENS name: name must be a non-empty string');
  }
  return name.toLowerCase().trim();
}

// ENS NameWrapper ABI for wrapping a domain
const NAME_WRAPPER_ABI = parseAbi([
  'function wrapETH2LD(string label, address wrappedOwner, uint16 ownerControlledFuses)',
  'function setSubnodeRecord(bytes32 parentNode, string label, address owner, address resolver, uint64 ttl, uint32 fuses, uint64 expiry)',
])

interface RegisterENSRequest {
  domain: string // e.g., "company.eth"
  ownerAddress: Address // The address that will own the domain
  resolver?: Address // Optional resolver address
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterENSRequest = await request.json()
    const { domain, ownerAddress, resolver } = body

    if (!domain || !ownerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: domain, ownerAddress' },
        { status: 400 }
      )
    }

    // Normalize the domain
    const normalized = normalize(domain)
    
    // Extract label (part before .eth)
    const parts = normalized.split('.')
    if (parts.length !== 2 || !normalized.endsWith('.eth')) {
      return NextResponse.json(
        { error: 'Invalid domain format. Must be a .eth domain (e.g., company.eth)' },
        { status: 400 }
      )
    }
    
    const label = parts[0]
    const parentNode = namehash('eth') // Parent node for .eth TLD

    // Default values
    const defaultResolver = resolver || ('0x0000000000000000000000000000000000000000' as Address)
    const defaultTtl = BigInt(0)
    const defaultFuses = 0
    const defaultExpiry = BigInt(0) // 0 means no expiry
    const ownerControlledFuses = 0 // Allow owner to control subnames

    // For existing domains, we'll use setSubnodeRecord
    // For new registrations, you'd need ENS Registrar (commit/reveal + payment)
    // This assumes the domain is already registered and we're just setting up NameWrapper
    
    // Encode the function call for setSubnodeRecord
    const data = encodeFunctionData({
      abi: NAME_WRAPPER_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        parentNode,
        label,
        ownerAddress,
        defaultResolver,
        defaultTtl,
        defaultFuses,
        defaultExpiry,
      ],
    })

    // Return the transaction data for the client to sign and send
    return NextResponse.json({
      success: true,
      transaction: {
        to: ENS_NAME_WRAPPER_ADDRESS,
        data,
        chainId: ENS_CHAIN_ID, // Sepolia
      },
      domain: normalized,
      message: 'Transaction data prepared. Sign and send this transaction to register the domain in NameWrapper.',
      note: 'This assumes the domain is already registered. For new domain registration, use ENS Registrar (app.ens.domains).',
    })
  } catch (error: any) {
    console.error('Error preparing ENS registration:', error)
    return NextResponse.json(
      { 
        error: 'Failed to prepare ENS registration',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
