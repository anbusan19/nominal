import { NextRequest, NextResponse } from 'next/server'
import { Address, parseUnits } from 'viem'
import { getCompany, getEmployeesByCompany } from '@/lib/storage/employees'
import { PAYROLL_VAULT_ADDRESS } from '@/lib/config/constants'
import { PAYROLL_VAULT_ABI } from '@/lib/contracts/abis'
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arc } from '@/lib/config/chains'
import { resolveENSName } from '@/lib/ens/utils'
import { sepolia } from 'viem/chains'

interface ExecutePayrollRequest {
  companyEnsName: string
  amounts?: Record<string, string> // Optional: specific amounts per employee address, otherwise equal split
  adminPrivateKey?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ExecutePayrollRequest = await request.json()
    const { companyEnsName, amounts, adminPrivateKey } = body

    if (!companyEnsName) {
      return NextResponse.json(
        { error: 'Missing required field: companyEnsName' },
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

    if (!company.treasuryAddress) {
      return NextResponse.json(
        { error: 'Company treasury not funded' },
        { status: 400 }
      )
    }

    const employees = getEmployeesByCompany(companyEnsName)
    if (employees.length === 0) {
      return NextResponse.json(
        { error: 'No employees registered' },
        { status: 400 }
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

    // Resolve all employee addresses from their sub-ENS names
    // Note: resolveENSName uses mainnet by default, but sub-ENS might be on Sepolia
    // For now, we'll use the wallet address directly since sub-ENS might not be resolved yet
    const recipients: Address[] = []
    const paymentAmounts: bigint[] = []

    for (const employee of employees) {
      // Use the wallet address directly (sub-ENS resolution can be done client-side)
      // In production, you'd want to resolve the sub-ENS to get the current address
      const address = employee.walletAddress as Address

      recipients.push(address)

      // Get amount for this employee
      let amount: bigint
      if (amounts && amounts[employee.walletAddress]) {
        // Use specified amount
        amount = parseUnits(amounts[employee.walletAddress], 6)
      } else if (amounts && amounts[address]) {
        // Use specified amount by resolved address
        amount = parseUnits(amounts[address], 6)
      } else {
        // Equal split - we'll calculate this after getting treasury balance
        amount = BigInt(0) // Placeholder
      }

      paymentAmounts.push(amount)
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No valid employee addresses found' },
        { status: 400 }
      )
    }

    // If no specific amounts provided, do equal split
    if (!amounts) {
      // Get treasury balance
      const balance = await publicClient.readContract({
        address: PAYROLL_VAULT_ADDRESS,
        abi: PAYROLL_VAULT_ABI,
        functionName: 'balance',
      })

      const amountPerEmployee = balance / BigInt(recipients.length)
      paymentAmounts.fill(amountPerEmployee)
    }

    // Execute batch distribution
    const hash = await walletClient.writeContract({
      address: PAYROLL_VAULT_ADDRESS,
      abi: PAYROLL_VAULT_ABI,
      functionName: 'batchDistribute',
      args: [recipients, paymentAmounts],
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    return NextResponse.json({
      success: true,
      transactionHash: hash,
      receipt,
      recipients: recipients.map((addr, i) => ({
        address: addr,
        amount: paymentAmounts[i].toString(),
        employee: employees[i],
      })),
    })
  } catch (error: any) {
    console.error('Error executing payroll:', error)
    return NextResponse.json(
      { error: 'Failed to execute payroll', details: error.message },
      { status: 500 }
    )
  }
}
