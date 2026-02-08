'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import employeesData from '@/lib/employees.json'

interface Employee {
  name: string
  ensSubname: string
  walletAddress: string
  salary: number
}

export function PayrollButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExecutePayroll = async () => {
    setIsLoading(true)
    setError(null)
    setTxHash(null)

    try {
      const employees = employeesData as Employee[]
      
      // Prepare batch transfer data
      const recipients = employees.map(emp => emp.walletAddress)
      const amounts = employees.map(emp => emp.salary)

      // TODO: Replace with actual Circle Developer Wallet SDK call
      // This is a placeholder that simulates the API call
      const simulateCircleBatchTransfer = async () => {
        // In production, this would be:
        // const response = await circleWallet.batchTransfer({
        //   recipients,
        //   amounts,
        //   token: 'USDC'
        // })
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate transaction hash
        const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')
        
        return mockTxHash
      }

      const hash = await simulateCircleBatchTransfer()
      setTxHash(hash)
    } catch (err) {
      console.error('Error executing payroll:', err)
      setError('Failed to execute payroll. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleExecutePayroll}
        disabled={isLoading}
        className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
        variant="primary"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Execute Global Payroll'
        )}
      </Button>

      {txHash && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
            ✅ Success! Payroll executed successfully
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 font-mono break-all">
            Transaction Hash: {txHash}
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            ❌ {error}
          </p>
        </div>
      )}
    </div>
  )
}
