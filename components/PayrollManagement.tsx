'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { Button } from './ui/Button'
import { prepareBatchDistribute, prepareDeposit } from '@/lib/contracts/payroll'
import { PAYROLL_VAULT_ABI } from '@/lib/contracts/abis'
import { ARC_USDC_ADDRESS } from '@/lib/config/chains'

export function PayrollManagement() {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)

  const { writeContract: depositContract } = useWriteContract()
  const { writeContract: distributeContract } = useWriteContract()

  // Read vault balance
  const { data: balance } = useReadContract({
    address: process.env.NEXT_PUBLIC_PAYROLL_VAULT_ADDRESS as `0x${string}`,
    abi: PAYROLL_VAULT_ABI,
    functionName: 'balance',
  })

  const handleDeposit = async () => {
    if (!isConnected || !depositAmount) return

    try {
      setIsDepositing(true)
      const amount = BigInt(parseFloat(depositAmount) * 10**6) // USDC has 6 decimals
      
      // First approve
      const approveTx = prepareDeposit(amount)
      await depositContract(approveTx)
      
      // Then deposit (would need separate deposit function)
      // await depositContract({ ... })
    } catch (error) {
      console.error('Error depositing:', error)
    } finally {
      setIsDepositing(false)
    }
  }

  const handleBatchDistribute = async () => {
    // TODO: Fetch employee list and amounts
    // For now, this is a placeholder
    const recipients: `0x${string}`[] = []
    const amounts: bigint[] = []
    
    if (recipients.length === 0) {
      alert('No employees to distribute to')
      return
    }

    try {
      const txData = prepareBatchDistribute(recipients, amounts)
      await distributeContract(txData)
    } catch (error) {
      console.error('Error distributing payroll:', error)
    }
  }

  if (!isConnected) {
    return <p className="text-gray-400">Please connect your wallet to continue</p>
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border border-white/10 bg-[#0A0A0A] rounded-lg">
        <p className="text-sm text-gray-400">Vault Balance</p>
        <p className="text-2xl font-bold text-white">
          {balance ? `${Number(balance) / 10**6} USDC` : 'Loading...'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Deposit Amount (USDC)
        </label>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="1000"
          className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange/50 bg-[#0A0A0A] text-white placeholder-gray-500"
        />
      </div>
      <Button
        onClick={handleDeposit}
        disabled={!depositAmount || isDepositing}
      >
        {isDepositing ? 'Depositing...' : 'Deposit USDC'}
      </Button>

      <div className="pt-4 border-t border-white/10">
        <Button
          onClick={handleBatchDistribute}
          variant="outline"
          className="w-full"
        >
          Distribute Payroll to All Employees
        </Button>
      </div>
    </div>
  )
}
