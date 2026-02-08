import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, createPublicClient, http, Address, namehash, parseAccount } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { ENS_NAME_WRAPPER_ADDRESS, ENS_PUBLIC_RESOLVER, ENS_CHAIN_ID } from '@/lib/config/constants'
import { ENS_NAME_WRAPPER_ABI } from '@/lib/contracts/abis'

/**
 * Simple ENS name normalization
 */
function normalize(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid ENS name: name must be a non-empty string')
  }
  return name.toLowerCase().trim()
}

interface IssueSubnameRequest {
  parentDomain: string // e.g., "company.eth"
  label: string // e.g., "worker"
  employeeAddress: Address // The employee's address that will own the subname
  resolver?: Address // Optional resolver address (defaults to Public Resolver)
  ttl?: bigint // Optional TTL (defaults to 0)
  fuses?: number // Optional fuses (defaults to 0)
  expiry?: bigint // Optional expiry (defaults to 0 = no expiry)
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin private key
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY
    if (!adminPrivateKey) {
      return NextResponse.json(
        { error: 'Admin private key not configured. Please set ADMIN_PRIVATE_KEY in .env' },
        { status: 500 }
      )
    }

    const body: IssueSubnameRequest = await request.json()
    const { parentDomain, label, employeeAddress, resolver, ttl, fuses, expiry } = body

    if (!parentDomain || !label || !employeeAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: parentDomain, label, employeeAddress' },
        { status: 400 }
      )
    }

    // Validate employee address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(employeeAddress)) {
      return NextResponse.json(
        { error: 'Invalid employee address format' },
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
    const defaultResolver = resolver || ENS_PUBLIC_RESOLVER
    const defaultTtl = ttl || BigInt(0)
    const defaultFuses = fuses || 0
    const defaultExpiry = expiry || BigInt(0) // 0 means no expiry

    // Create account from private key
    const account = privateKeyToAccount(adminPrivateKey as `0x${string}`)

    // Create wallet and public clients
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(),
    })

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    })

    // Send the transaction
    const hash = await walletClient.writeContract({
      address: ENS_NAME_WRAPPER_ADDRESS,
      abi: ENS_NAME_WRAPPER_ABI,
      functionName: 'setSubnodeRecord',
      args: [
        parentNode,
        normalizedLabel,
        employeeAddress,
        defaultResolver,
        defaultTtl,
        defaultFuses,
        defaultExpiry,
      ],
    })

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    const subname = `${normalizedLabel}.${normalizedParent}`

    return NextResponse.json({
      success: true,
      transactionHash: hash,
      receipt,
      subname,
      message: `Successfully issued subname ${subname} to ${employeeAddress}`,
    })
  } catch (error: any) {
    console.error('Error issuing subname:', error)
    return NextResponse.json(
      { 
        error: 'Failed to issue subname',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
