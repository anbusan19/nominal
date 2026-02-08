'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { WithdrawalWidget } from '@/components/Employee/WithdrawalWidget'
import { EmployeeBalance } from '@/components/Employee/EmployeeBalance'
import { arc } from '@/lib/config/chains'
import { ARC_USDC_ADDRESS } from '@/lib/config/chains'
import { ERC20_ABI } from '@/lib/contracts/abis'
import { formatUnits } from 'viem'

export default function EmployeePage() {
  const { address, isConnected } = useAccount()
  const [subEnsName, setSubEnsName] = useState<string | null>(null)

  // Get USDC balance on Arc
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: arc.id,
    query: {
      enabled: !!address && isConnected,
    },
  })

  useEffect(() => {
    // In production, fetch employee's sub-ENS from API based on wallet address
    // For now, this is a placeholder
    if (address) {
      // You would call: /api/employee/info?walletAddress=${address}
      // and get the subEnsName from the response
    }
  }, [address])

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to view your dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
          {subEnsName && (
            <p className="text-gray-600 dark:text-gray-400 font-mono">
              {subEnsName}
            </p>
          )}
          {address && (
            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
              {address}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Balance</h2>
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              {isLoadingBalance ? (
                <p className="text-gray-500">Loading balance...</p>
              ) : balance ? (
                <>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {formatUnits(balance, 6)} USDC
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    On Arc Network
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No balance found</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/employee/register"
                className="block p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="font-semibold">Register Sub-ENS</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get your employee subdomain
                </p>
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Withdraw & Bridge</h2>
          <WithdrawalWidget />
        </div>
      </div>
    </div>
  )
}
