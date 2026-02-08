'use client'

import { useEffect, useState } from 'react'

export function TreasuryBalance() {
  const [balance, setBalance] = useState<string>('Loading...')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch balance from Circle Wallet
    // For now, we'll use a placeholder. In production, this would call Circle API
    const fetchBalance = async () => {
      try {
        // TODO: Replace with actual Circle Wallet SDK call
        // const circleBalance = await getCircleWalletBalance()
        // For demo purposes, showing the hardcoded value
        setTimeout(() => {
          setBalance('$150,000 USDC')
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching balance:', error)
        setBalance('Error loading balance')
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [])

  return (
    <p className="text-3xl font-bold text-gray-900 dark:text-white">
      {isLoading ? 'Loading...' : balance}
    </p>
  )
}
