'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from './ui/Button'
import { normalizeENSName } from '@/lib/ens/utils'

export function CorporateOnboarding() {
  const { address, isConnected } = useAccount()
  const [ensDomain, setEnsDomain] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleRegister = async () => {
    if (!isConnected || !ensDomain) return

    try {
      setIsLoading(true)
      const normalized = normalizeENSName(ensDomain)
      
      // TODO: Implement ENS domain registration logic
      // This would involve:
      // 1. Check if domain is available
      // 2. Register domain if needed
      // 3. Set up NameWrapper permissions
      
      console.log('Registering domain:', normalized)
      // Placeholder for actual registration
    } catch (error) {
      console.error('Error registering domain:', error)
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
          ENS Domain (e.g., company.eth)
        </label>
        <input
          type="text"
          value={ensDomain}
          onChange={(e) => setEnsDomain(e.target.value)}
          placeholder="company.eth"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <Button
        onClick={handleRegister}
        disabled={!ensDomain || isLoading || isConfirming}
      >
        {isLoading || isConfirming ? 'Processing...' : 'Register Domain'}
      </Button>
      {isSuccess && (
        <p className="text-green-600 text-sm">Domain registered successfully!</p>
      )}
    </div>
  )
}
