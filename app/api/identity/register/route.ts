import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, Address, namehash, encodeFunctionData, parseAbi } from 'viem'
import { sepolia } from 'viem/chains'
import { ENS_NAME_WRAPPER_ADDRESS } from '@/lib/config/constants'

/**
 * Simple ENS name normalization
 * For production, consider using @ensdomains/ensjs normalize function
 */
function normalize(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid ENS name: name must be a non-empty string');
  }
  return name.toLowerCase().trim();
}

// ENS NameWrapper ABI for setSubnodeRecord
const NAME_WRAPPER_ABI = parseAbi([
  'function setSubnodeRecord(bytes32 parentNode, string label, address owner, address resolver, uint64 ttl, uint32 fuses, uint64 expiry)',
  'function ownerOf(uint256 id) view returns (address)',
])

// Create public client for Sepolia
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

interface RegisterRequest {
  parentDomain: string // e.g., "nominal.eth"
  label: string // e.g., "worker"
  ownerAddress: Address // The address that will own the subname
  resolver?: Address // Optional resolver address
  ttl?: bigint // Optional TTL
  fuses?: number // Optional fuses (0 for default)
  expiry?: bigint // Optional expiry timestamp
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { parentDomain, label, ownerAddress, resolver, ttl, fuses, expiry } = body

    if (!parentDomain || !label || !ownerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: parentDomain, label, ownerAddress' },
        { status: 400 }
      )
    }

    // Normalize the parent domain
    const normalizedParent = normalize(parentDomain)
    
    // Compute namehash of parent domain
    const parentNode = namehash(normalizedParent)
    
    // Normalize the label
    const normalizedLabel = normalize(label)

    // Default values
    const defaultResolver = resolver || ('0x0000000000000000000000000000000000000000' as Address)
    const defaultTtl = ttl || BigInt(0)
    const defaultFuses = fuses || 0
    const defaultExpiry = expiry || BigInt(0) // 0 means no expiry

    // Encode the function call
    const data = encodeFunctionData({
      abi: NAME_WRAPPER_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        parentNode,
        normalizedLabel,
        ownerAddress,
        defaultResolver,
        defaultTtl,
        defaultFuses,
        defaultExpiry,
      ],
    })

    // Return the transaction data for the client to sign and send
    // In a production setup, you might want to use a relayer or have the client sign directly
    return NextResponse.json({
      success: true,
      transaction: {
        to: ENS_NAME_WRAPPER_ADDRESS,
        data,
        chainId: sepolia.id,
      },
      subname: `${label}.${parentDomain}`,
      message: 'Transaction data prepared. Sign and send this transaction to register the subname.',
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
