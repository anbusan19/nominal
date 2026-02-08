'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from './ui/Button'
import { getRoutes } from '@/lib/lifi/client'
import { arc } from '@/lib/config/chains'

export function EmployeeWithdrawal() {
  const { address, isConnected } = useAccount()
  const [destinationChain, setDestinationChain] = useState('base')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Chain ID mapping (simplified)
  const chainIds: Record<string, number> = {
    base: 8453,
    arbitrum: 42161,
    polygon: 137,
    ethereum: 1,
  }

  const handleBridge = async () => {
    if (!isConnected || !address || !amount) return

    try {
      setIsLoading(true)
      
      // Get routes from LI.FI
      const routes = await getRoutes({
        fromChain: arc.id,
        toChain: chainIds[destinationChain] || 8453,
        fromToken: 'USDC', // USDC on Arc
        toToken: 'USDC', // USDC on destination
        fromAmount: (parseFloat(amount) * 10**6).toString(), // USDC has 6 decimals
        fromAddress: address,
      })

      if (routes.routes.length === 0) {
        alert('No routes found')
        return
      }

      // TODO: Execute the route using LI.FI SDK
      // This would require wallet signing
      console.log('Available routes:', routes)
      alert('Route found! Integration with wallet signing needed.')
    } catch (error) {
      console.error('Error getting routes:', error)
      alert('Failed to get bridge routes')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return <p className="text-gray-500">Please connect your wallet to continue</p>
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Amount to Bridge (USDC)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Destination Chain
        </label>
        <select
          value={destinationChain}
          onChange={(e) => setDestinationChain(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="base">Base</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="polygon">Polygon</option>
          <option value="ethereum">Ethereum</option>
        </select>
      </div>
      <Button
        onClick={handleBridge}
        disabled={!amount || isLoading}
      >
        {isLoading ? 'Finding Route...' : 'Claim & Bridge'}
      </Button>
      <p className="text-xs text-gray-500">
        This will bridge your USDC from Arc to {destinationChain} using LI.FI
      </p>
    </div>
  )
}
