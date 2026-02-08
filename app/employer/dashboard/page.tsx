'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { EmployerDashboard } from '@/components/EmployerDashboard'
import { TreasuryFunding } from '@/components/TreasuryFunding'
import { CompanyRegistration } from '@/components/CompanyRegistration'
import { Button } from '@/components/ui/Button'

export default function EmployerDashboardPage() {
  const { address, isConnected } = useAccount()
  const [companyEnsName, setCompanyEnsName] = useState<string | null>(null)
  const [step, setStep] = useState<'register' | 'fund' | 'dashboard'>('register')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has a registered company
    // Store company ENS name in localStorage after registration
    if (address) {
      const stored = localStorage.getItem(`company_ens_${address}`)
      if (stored) {
        setCompanyEnsName(stored)
        setStep('dashboard')
      }
      setLoading(false)
    }
  }, [address])

  const handleDomainRegistered = () => {
    // Company ENS name is stored in localStorage by CompanyRegistration
    if (address) {
      const stored = localStorage.getItem(`company_ens_${address}`)
      if (stored) {
        setCompanyEnsName(stored)
        setStep('fund')
      }
    }
  }

  // Check for company after registration completes
  useEffect(() => {
    if (address && step === 'register') {
      const checkInterval = setInterval(() => {
        const stored = localStorage.getItem(`company_ens_${address}`)
        if (stored) {
          setCompanyEnsName(stored)
          setStep('fund')
          clearInterval(checkInterval)
        }
      }, 1000)
      return () => clearInterval(checkInterval)
    }
  }, [address, step])

  const handleTreasuryFunded = () => {
    setStep('dashboard')
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to continue
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>

        {step === 'register' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 1: Register Your Company ENS Domain</h2>
              <CompanyRegistration />
            </div>
          </div>
        )}

        {step === 'fund' && companyEnsName && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 2: Fund Your Treasury</h2>
              <TreasuryFunding companyEnsName={companyEnsName} onFunded={handleTreasuryFunded} />
            </div>
            <Button onClick={() => setStep('dashboard')} variant="outline">
              Skip to Dashboard
            </Button>
          </div>
        )}

        {step === 'dashboard' && companyEnsName && (
          <div>
            <EmployerDashboard companyEnsName={companyEnsName} />
          </div>
        )}
      </div>
    </div>
  )
}
