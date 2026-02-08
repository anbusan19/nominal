'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { Address } from 'viem'
import { resolveENSName } from '@/lib/ens/utils'

interface Employee {
  id: string
  walletAddress: string
  subEnsName: string
  companyEnsName: string
  name?: string
  email?: string
  createdAt: number
}

interface Company {
  ensName: string
  ownerAddress: string
  treasuryAddress?: string
  employees: Employee[]
  createdAt: number
}

export function EmployerDashboard({ companyEnsName }: { companyEnsName: string }) {
  const { address, isConnected } = useAccount()
  const [company, setCompany] = useState<Company | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [treasuryBalance, setTreasuryBalance] = useState<string | null>(null)
  const [resolvingAddresses, setResolvingAddresses] = useState<Set<string>>(new Set())
  const [resolvedAddresses, setResolvedAddresses] = useState<Record<string, Address>>({})

  useEffect(() => {
    if (companyEnsName) {
      loadCompanyData()
    }
  }, [companyEnsName])

  const loadCompanyData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/employer/employees?companyEnsName=${encodeURIComponent(companyEnsName)}`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to load company data')
      }

      const data = await response.json()
      setCompany(data.company)
      setEmployees(data.employees)

      // Load treasury balance if treasury exists
      if (data.company.treasuryAddress) {
        await loadTreasuryBalance(data.company.treasuryAddress)
      }

      // Resolve employee addresses
      for (const employee of data.employees) {
        resolveEmployeeAddress(employee.subEnsName)
      }
    } catch (err: any) {
      console.error('Error loading company data:', err)
      setError(err.message || 'Failed to load company data')
    } finally {
      setLoading(false)
    }
  }

  const loadTreasuryBalance = async (treasuryAddress: string) => {
    try {
      // This would call the PayrollVault contract to get balance
      // For now, we'll just show the address
      setTreasuryBalance(treasuryAddress)
    } catch (err) {
      console.error('Error loading treasury balance:', err)
    }
  }

  const resolveEmployeeAddress = async (subEnsName: string) => {
    if (resolvedAddresses[subEnsName] || resolvingAddresses.has(subEnsName)) {
      return
    }

    setResolvingAddresses((prev) => new Set(prev).add(subEnsName))

    try {
      const address = await resolveENSName(subEnsName)
      if (address) {
        setResolvedAddresses((prev) => ({
          ...prev,
          [subEnsName]: address,
        }))
      }
    } catch (err) {
      console.error(`Error resolving ${subEnsName}:`, err)
    } finally {
      setResolvingAddresses((prev) => {
        const next = new Set(prev)
        next.delete(subEnsName)
        return next
      })
    }
  }

  const handleExecutePayroll = async () => {
    if (!companyEnsName) return

    try {
      setError(null)
      const response = await fetch('/api/payroll/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyEnsName }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to execute payroll')
      }

      const data = await response.json()
      alert(`Payroll executed successfully! TX: ${data.transactionHash}`)
      await loadCompanyData() // Reload to update balances
    } catch (err: any) {
      console.error('Error executing payroll:', err)
      setError(err.message || 'Failed to execute payroll')
    }
  }

  if (!isConnected) {
    return (
      <div className="p-4 border border-white/10 bg-[#0A0A0A] rounded-lg">
        <p className="text-gray-400">
          Please connect your wallet to view the dashboard
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">Loading company data...</p>
      </div>
    )
  }

  if (error && !company) {
    return (
      <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-manrope text-white">Company Dashboard</h2>
          <p className="text-gray-400 font-mono">{company?.ensName}</p>
        </div>
        {company?.treasuryAddress && (
          <Button onClick={handleExecutePayroll} variant="primary">
            Execute Payroll
          </Button>
        )}
      </div>

      {company?.treasuryAddress && (
        <div className="p-4 border border-brand-orange/30 bg-brand-orange/10 rounded-lg">
          <p className="text-sm font-medium text-brand-orange">
            Treasury Address
          </p>
          <p className="text-xs font-mono text-gray-300 break-all">
            {company.treasuryAddress}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold font-manrope mb-4 text-white">Employees ({employees.length})</h3>
        {employees.length === 0 ? (
          <p className="text-gray-400">No employees registered yet</p>
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="p-4 border border-white/10 bg-[#0A0A0A] rounded-lg hover:border-brand-orange/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{employee.name || 'Unnamed Employee'}</p>
                    <p className="text-sm text-gray-400 font-mono">
                      {employee.subEnsName}
                    </p>
                    {resolvedAddresses[employee.subEnsName] && (
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        Resolved: {resolvedAddresses[employee.subEnsName]}
                      </p>
                    )}
                    {resolvingAddresses.has(employee.subEnsName) && (
                      <p className="text-xs text-gray-400 mt-1">Resolving...</p>
                    )}
                    {employee.email && (
                      <p className="text-sm text-gray-400 mt-1">
                        {employee.email}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Wallet: {employee.walletAddress.slice(0, 6)}...{employee.walletAddress.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 border border-red-500/30 bg-red-500/10 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
