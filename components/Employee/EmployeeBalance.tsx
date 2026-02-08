'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export function EmployeeBalance() {
  const { address } = useAccount()
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!address) {
      setIsLoading(false)
      return
    }

    // Fetch USDC balance for the connected wallet
    // In production, this would check the actual balance on Arc
    const fetchBalance = async () => {
      try {
        // TODO: Replace with actual balance check from Arc
        // For demo, showing a placeholder
        setTimeout(() => {
          setBalance('5,000')
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching balance:', error)
        setBalance('0')
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [address])

  if (!address) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Please connect your wallet to view your balance
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        Your Balance
      </p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {isLoading ? 'Loading...' : `${balance} USDC`}
      </p>
    </div>
  )
}
