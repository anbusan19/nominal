import { NextRequest, NextResponse } from 'next/server'
import { Address, parseUnits } from 'viem'
import { getCompany, updateCompanyTreasury } from '@/lib/storage/employees'
import { PAYROLL_VAULT_ADDRESS } from '@/lib/config/constants'
import { PAYROLL_VAULT_ABI } from '@/lib/contracts/abis'
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arc } from '@/lib/config/chains'

interface FundTreasuryRequest {
  companyEnsName: string
  amount: string // Amount in USDC (6 decimals on Arc)
  adminPrivateKey?: string // Optional, uses env if not provided
}

export async function POST(request: NextRequest) {
  try {
    const body: FundTreasuryRequest = await request.json()
    const { companyEnsName, amount, adminPrivateKey } = body

    if (!companyEnsName || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: companyEnsName, amount' },
        { status: 400 }
      )
    }

    const company = getCompany(companyEnsName)
    if (!company) {
      return NextResponse.json(
        { error: `Company ${companyEnsName} not found` },
        { status: 404 }
      )
    }

    // Use admin private key from env or request
    const privateKey = adminPrivateKey || process.env.ADMIN_PRIVATE_KEY
    if (!privateKey) {
      return NextResponse.json(
        { error: 'Admin private key not configured' },
        { status: 500 }
      )
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`)

    const walletClient = createWalletClient({
      account,
      chain: arc,
      transport: http(process.env.NEXT_PUBLIC_ARC_RPC_URL),
    })

    const publicClient = createPublicClient({
      chain: arc,
      transport: http(process.env.NEXT_PUBLIC_ARC_RPC_URL),
    })

    // Parse amount (USDC has 6 decimals on Arc)
    const amountWei = parseUnits(amount, 6)

    // Deposit to PayrollVault
    const hash = await walletClient.writeContract({
      address: PAYROLL_VAULT_ADDRESS,
      abi: PAYROLL_VAULT_ABI,
      functionName: 'deposit',
      args: [amountWei],
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    // Update company with treasury address
    updateCompanyTreasury(companyEnsName, PAYROLL_VAULT_ADDRESS)

    return NextResponse.json({
      success: true,
      transactionHash: hash,
      receipt,
      treasuryAddress: PAYROLL_VAULT_ADDRESS,
      amount: amount,
    })
  } catch (error: any) {
    console.error('Error funding treasury:', error)
    return NextResponse.json(
      { error: 'Failed to fund treasury', details: error.message },
      { status: 500 }
    )
  }
}
