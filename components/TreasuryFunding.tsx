'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { arc } from '@/lib/config/chains'
import { ARC_USDC_ADDRESS } from '@/lib/config/chains'
import { PAYROLL_VAULT_ADDRESS } from '@/lib/config/constants'
import { PAYROLL_VAULT_ABI, ERC20_ABI } from '@/lib/contracts/abis'
import { parseUnits, formatUnits } from 'viem'

interface TreasuryFundingProps {
  companyEnsName: string
  onFunded?: () => void
}

export function TreasuryFunding({ companyEnsName, onFunded }: TreasuryFundingProps) {
  const { address, isConnected, chainId } = useAccount()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'approve' | 'deposit'>('approve')

  // Approve USDC
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApproving,
  } = useWriteContract()

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
      chainId: arc.id,
    })

  // Deposit to vault
  const {
    writeContract: writeDeposit,
    data: depositHash,
    isPending: isDepositing,
  } = useWriteContract()

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: depositHash,
      chainId: arc.id,
    })

  // Check allowance
  const { data: allowance } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && PAYROLL_VAULT_ADDRESS ? [address, PAYROLL_VAULT_ADDRESS] : undefined,
    chainId: arc.id,
    query: {
      enabled: !!address && step === 'approve',
    },
  })

  // Check balance
  const { data: balance } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: arc.id,
    query: {
      enabled: !!address,
    },
  })

  const handleApprove = async () => {
    if (!isConnected || !address || !amount) {
      setError('Please connect wallet and enter amount')
      return
    }

    if (chainId !== arc.id) {
      setError(`Please switch to Arc network (Chain ID: ${arc.id})`)
      return
    }

    try {
      setError(null)
      const amountWei = parseUnits(amount, 6) // USDC has 6 decimals on Arc

      await writeApprove({
        address: ARC_USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PAYROLL_VAULT_ADDRESS, amountWei],
        chainId: arc.id,
      })
    } catch (err: any) {
      console.error('Error approving:', err)
      setError(err.message || 'Failed to approve USDC')
    }
  }

  const handleDeposit = async () => {
    if (!isConnected || !address || !amount) {
      setError('Please connect wallet and enter amount')
      return
    }

    if (chainId !== arc.id) {
      setError(`Please switch to Arc network (Chain ID: ${arc.id})`)
      return
    }

    try {
      setError(null)
      setLoading(true)

      const amountWei = parseUnits(amount, 6)

      // First approve if needed
      if (!allowance || allowance < amountWei) {
        await writeApprove({
          address: ARC_USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [PAYROLL_VAULT_ADDRESS, amountWei],
          chainId: arc.id,
        })
        // Wait for approval
        return
      }

      // Then deposit
      await writeDeposit({
        address: PAYROLL_VAULT_ADDRESS,
        abi: PAYROLL_VAULT_ABI,
        functionName: 'deposit',
        args: [amountWei],
        chainId: arc.id,
      })

      // Also register treasury with company
      await fetch('/api/employer/fund-treasury', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyEnsName,
          amount,
        }),
      })
    } catch (err: any) {
      console.error('Error depositing:', err)
      setError(err.message || 'Failed to deposit to treasury')
    } finally {
      setLoading(false)
    }
  }

  // Handle approval success
  useEffect(() => {
    if (isApproveSuccess) {
      setStep('deposit')
    }
  }, [isApproveSuccess])

  // Handle deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      setAmount('')
      setStep('approve')
      if (onFunded) {
        onFunded()
      }
    }
  }, [isDepositSuccess, onFunded])

  if (!isConnected) {
    return (
      <div className="p-4 border border-white/10 bg-[#0A0A0A] rounded-lg">
        <p className="text-gray-400">
          Please connect your wallet to fund the treasury
        </p>
      </div>
    )
  }

  if (chainId !== arc.id) {
    return (
      <div className="p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg">
        <p className="text-yellow-400">
          Please switch to Arc network to fund the treasury
        </p>
      </div>
    )
  }

  const amountWei = amount ? parseUnits(amount, 6) : BigInt(0)
  const needsApproval = !allowance || allowance < amountWei
  const hasBalance = balance ? balance >= amountWei : false

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold font-manrope mb-2 text-white">Fund Treasury</h3>
        <p className="text-sm text-gray-400 mb-4">
          Deposit USDC into the payroll vault on Arc network
        </p>
      </div>

      {balance && (
        <div className="p-3 border border-white/10 bg-[#0A0A0A] rounded-lg">
          <p className="text-sm text-gray-400">
            Your USDC Balance: <span className="font-mono font-semibold text-brand-orange">{formatUnits(balance, 6)} USDC</span>
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Amount (USDC)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setError(null)
          }}
          placeholder="1000"
          step="0.000001"
          min="0"
          className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange/50 bg-[#0A0A0A] text-white placeholder-gray-500"
          disabled={loading || isApproving || isApproveConfirming || isDepositing || isDepositConfirming}
        />
      </div>

      {needsApproval && step === 'approve' && (
        <Button
          onClick={handleApprove}
          disabled={!amount || !hasBalance || isApproving || isApproveConfirming}
          variant="primary"
          className="w-full"
        >
          {isApproving || isApproveConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isApproving ? 'Signing...' : 'Confirming...'}
            </span>
          ) : (
            'Approve USDC'
          )}
        </Button>
      )}

      {(!needsApproval || step === 'deposit') && (
        <Button
          onClick={handleDeposit}
          disabled={!amount || !hasBalance || isDepositing || isDepositConfirming}
          variant="primary"
          className="w-full"
        >
          {isDepositing || isDepositConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isDepositing ? 'Signing...' : 'Confirming...'}
            </span>
          ) : (
            'Deposit to Treasury'
          )}
        </Button>
      )}

      {error && (
        <div className="p-3 border border-red-500/30 bg-red-500/10 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {approveHash && (
        <div className="p-3 border border-white/10 bg-[#0A0A0A] rounded-lg">
          <p className="text-xs text-gray-400 font-mono break-all">
            Approve TX: {approveHash}
          </p>
        </div>
      )}

      {depositHash && (
        <div className="p-3 border border-white/10 bg-[#0A0A0A] rounded-lg">
          <p className="text-xs text-gray-400 font-mono break-all">
            Deposit TX: {depositHash}
          </p>
        </div>
      )}
    </div>
  )
}
