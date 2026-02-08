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
      <main className="relative min-h-screen pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden bg-black font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[100vw] h-[100vw] max-w-[2000px] max-h-[2000px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 bg-brand-orange/10 blur-[150px] rounded-full" />
          </div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-manrope mb-4 text-white">Employer Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Please connect your wallet to continue
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="relative min-h-screen pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden bg-black font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden bg-black font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[100vw] h-[100vw] max-w-[2000px] max-h-[2000px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-brand-orange/10 blur-[150px] rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <header>
          <span className="text-brand-orange font-mono text-sm tracking-[0.2em] mb-4 inline-block uppercase font-bold px-3 py-1 rounded border border-brand-orange/20 bg-brand-orange/10">
            EMPLOYER DASHBOARD
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-manrope mb-4 text-white">
            Company Management
          </h1>
        </header>

        {step === 'register' && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-8 hover:border-brand-orange/30 transition-colors duration-500">
              <h2 className="text-2xl font-semibold font-manrope mb-6 text-white">Step 1: Register Your Company ENS Domain</h2>
              <CompanyRegistration />
            </div>
          </div>
        )}

        {step === 'fund' && companyEnsName && (
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-8 hover:border-brand-orange/30 transition-colors duration-500">
                <h2 className="text-2xl font-semibold font-manrope mb-6 text-white">Step 2: Fund Your Treasury</h2>
                <TreasuryFunding companyEnsName={companyEnsName} onFunded={handleTreasuryFunded} />
              </div>
            </div>
            <Button onClick={() => setStep('dashboard')} variant="outline" className="w-full">
              Skip to Dashboard
            </Button>
          </div>
        )}

        {step === 'dashboard' && companyEnsName && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-8 hover:border-brand-orange/30 transition-colors duration-500">
              <EmployerDashboard companyEnsName={companyEnsName} />
            </div>
          </div>
        )}
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </main>
  )
}
