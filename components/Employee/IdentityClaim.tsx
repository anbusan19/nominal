'use client'

import { useState, useEffect } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { sepolia } from 'viem/chains'
import { ENS_NAME_WRAPPER_ADDRESS } from '@/lib/config/constants'

export function IdentityClaim() {
  const { address, isConnected } = useAccount()
  const [username, setUsername] = useState('')
  const [isMinting, setIsMinting] = useState(false)
  const [mintedSubname, setMintedSubname] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { sendTransaction, data: hash, isPending: isSending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: sepolia.id,
  })

  const handleMintIdentity = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    setIsMinting(true)
    setError(null)

    try {
      // Call the identity registration API to prepare ENS subname transaction
      const response = await fetch('/api/identity/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentDomain: 'nominal.eth',
          label: username,
          ownerAddress: address,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to prepare ENS registration')
      }

      const data = await response.json()
      
      if (!data.transaction) {
        throw new Error('No transaction data returned')
      }

      // Execute the transaction using wagmi's sendTransaction
      // The API returns the encoded transaction data, which we'll send directly
      await sendTransaction({
        to: data.transaction.to as `0x${string}`,
        data: data.transaction.data as `0x${string}`,
        chainId: data.transaction.chainId,
      })
      
      // The transaction hash will be available in the hash variable from useSendTransaction
      // Success will be handled by useWaitForTransactionReceipt
    } catch (err: any) {
      console.error('Error minting identity:', err)
      setError(err.message || 'Failed to mint subname. Please try again.')
    } finally {
      setIsMinting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Please connect your wallet to claim your identity
        </p>
      </div>
    )
  }

  // Update minted subname when transaction succeeds
  useEffect(() => {
    if (txSuccess && username && !mintedSubname) {
      setMintedSubname(`${username}.nominal.eth`)
      setUsername('')
    }
  }, [txSuccess, username, mintedSubname])

  if (mintedSubname || txSuccess) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
          ✅ Identity Claimed Successfully!
        </p>
        <p className="text-lg font-mono text-green-600 dark:text-green-400">
          {mintedSubname || `${username}.nominal.eth`}
        </p>
        {hash && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-mono break-all">
            TX: {hash}
          </p>
        )}
        <Button
          onClick={() => {
            setMintedSubname(null)
          }}
          variant="outline"
          className="mt-4"
        >
          Claim Another Identity
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Choose your username
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))
              setError(null)
            }}
            placeholder="alice"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isMinting}
          />
          <span className="self-center text-gray-500 dark:text-gray-400">
            .nominal.eth
          </span>
        </div>
        {username && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your identity will be: <span className="font-mono">{username}.nominal.eth</span>
          </p>
        )}
      </div>

      <Button
        onClick={handleMintIdentity}
        disabled={!username || isMinting || isSending || isConfirming}
        variant="primary"
        className="w-full"
      >
        {isMinting || isWriting || isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {isSending ? 'Sign Transaction...' : isConfirming ? 'Confirming...' : 'Preparing...'}
          </span>
        ) : (
          'Mint Identity'
        )}
      </Button>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  )
}
