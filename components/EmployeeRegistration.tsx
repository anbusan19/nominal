'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { sepolia } from 'viem/chains'
import { Address } from 'viem'

export function EmployeeRegistration({ companyEnsName }: { companyEnsName: string }) {
  const { address, isConnected } = useAccount()
  const [label, setLabel] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [subEnsName, setSubEnsName] = useState<string | null>(null)

  const { sendTransaction, data: hash, isPending: isSending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: sepolia.id,
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    if (!label.trim()) {
      setError('Please enter a username/label')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Step 1: Register employee in our system
      const registerResponse = await fetch('/api/employee/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyEnsName,
          walletAddress: address,
          label: label.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      })

      if (!registerResponse.ok) {
        const data = await registerResponse.json()
        throw new Error(data.error || 'Failed to register employee')
      }

      const registerData = await registerResponse.json()
      const employeeSubEns = registerData.employee.subEnsName
      setSubEnsName(employeeSubEns)

      // Step 2: Issue sub-ENS via API (server signs the transaction)
      const ensResponse = await fetch('/api/issue-subname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentDomain: companyEnsName,
          label: label.trim(),
          employeeAddress: address,
        }),
      })

      if (!ensResponse.ok) {
        const data = await ensResponse.json()
        throw new Error(data.error || 'Failed to issue sub-ENS')
      }

      const ensData = await ensResponse.json()
      setSuccess(`Successfully registered! Your sub-ENS: ${employeeSubEns}`)
      
      // Clear form
      setLabel('')
      setName('')
      setEmail('')
    } catch (err: any) {
      console.error('Error registering employee:', err)
      setError(err.message || 'Failed to register employee')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Please connect your wallet to register
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          ✅ Registration Successful!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">{success}</p>
        {subEnsName && (
          <p className="text-sm font-mono text-green-600 dark:text-green-400 mb-4">
            {subEnsName}
          </p>
        )}
        <Button
          onClick={() => {
            setSuccess(null)
            setSubEnsName(null)
          }}
          variant="outline"
        >
          Register Another Employee
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Employee Registration</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Register for a sub-ENS domain under <span className="font-mono">{companyEnsName}</span>
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Username / Label *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                setLabel(value)
                setError(null)
              }}
              placeholder="alice"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading || isSending || isConfirming}
              required
            />
            <span className="self-center text-gray-500 dark:text-gray-400">
              .{companyEnsName}
            </span>
          </div>
          {label && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your sub-ENS will be: <span className="font-mono">{label}.{companyEnsName}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Name (Optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alice Smith"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading || isSending || isConfirming}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alice@example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading || isSending || isConfirming}
          />
        </div>

        <Button
          type="submit"
          disabled={!label || loading || isSending || isConfirming}
          variant="primary"
          className="w-full"
        >
          {loading || isSending || isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isSending ? 'Signing...' : isConfirming ? 'Confirming...' : 'Registering...'}
            </span>
          ) : (
            'Register Employee'
          )}
        </Button>
      </form>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  )
}
