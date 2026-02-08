'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Button } from './ui/Button'
import { normalizeENSName, isValidSubname } from '@/lib/ens/utils'
import { prepareAddEmployee } from '@/lib/contracts/payroll'

export function EmployeeProvisioning() {
  const { address, isConnected } = useAccount()
  const [parentDomain, setParentDomain] = useState('')
  const [subname, setSubname] = useState('')
  const [employeeAddress, setEmployeeAddress] = useState('')

  const { writeContract, isPending } = useWriteContract()

  const handleCreateSubname = async () => {
    if (!isConnected || !parentDomain || !subname || !employeeAddress) return

    try {
      const fullSubname = `${subname}.${parentDomain}`
      
      if (!isValidSubname(fullSubname)) {
        alert('Invalid subname format. Must be like: alice.company.eth')
        return
      }

      // TODO: Create ENS subname using NameWrapper
      // Then add employee to PayrollVault
      const txData = prepareAddEmployee(employeeAddress as `0x${string}`, fullSubname)
      
      await writeContract(txData)
    } catch (error) {
      console.error('Error creating subname:', error)
      alert('Failed to create subname')
    }
  }

  if (!isConnected) {
    return <p className="text-gray-500">Please connect your wallet to continue</p>
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Parent Domain (e.g., company.eth)
        </label>
        <input
          type="text"
          value={parentDomain}
          onChange={(e) => setParentDomain(e.target.value)}
          placeholder="company.eth"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Subname Label (e.g., alice)
        </label>
        <input
          type="text"
          value={subname}
          onChange={(e) => setSubname(e.target.value)}
          placeholder="alice"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Employee Address
        </label>
        <input
          type="text"
          value={employeeAddress}
          onChange={(e) => setEmployeeAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
        />
      </div>
      <Button
        onClick={handleCreateSubname}
        disabled={!parentDomain || !subname || !employeeAddress || isPending}
      >
        {isPending ? 'Processing...' : 'Create Subname & Add Employee'}
      </Button>
      {parentDomain && subname && (
        <p className="text-sm text-gray-600">
          Will create: <span className="font-mono">{subname}.{parentDomain}</span>
        </p>
      )}
    </div>
  )
}
