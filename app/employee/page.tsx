'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { WithdrawalWidget } from '@/components/Employee/WithdrawalWidget'
import { EmployeeBalance } from '@/components/Employee/EmployeeBalance'
import { arc } from '@/lib/config/chains'
import { ARC_USDC_ADDRESS } from '@/lib/config/chains'
import { ERC20_ABI } from '@/lib/contracts/abis'
import { formatUnits } from 'viem'
import { Wallet, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EmployeePage() {
  const { address, isConnected } = useAccount()
  const [subEnsName, setSubEnsName] = useState<string | null>(null)

  // Get USDC balance on Arc
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: arc.id,
    query: {
      enabled: !!address && isConnected,
    },
  })

  useEffect(() => {
    // In production, fetch employee's sub-ENS from API based on wallet address
    // For now, this is a placeholder
    if (address) {
      // You would call: /api/employee/info?walletAddress=${address}
      // and get the subEnsName from the response
    }
  }, [address])

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
          <h1 className="text-4xl md:text-6xl font-bold font-manrope mb-4 text-white">Employee Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Please connect your wallet to view your dashboard
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
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
            EMPLOYEE DASHBOARD
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-manrope mb-4 text-white">
            Your Payroll
          </h1>
          {subEnsName && (
            <p className="text-gray-400 font-mono text-lg mb-2">
              {subEnsName}
            </p>
          )}
          {address && (
            <p className="text-sm text-gray-500 font-mono">
              {address}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Balance Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-6 hover:border-brand-orange/30 transition-colors duration-500">
              <h2 className="text-xl font-semibold font-manrope mb-4 text-white">Your Balance</h2>
              {isLoadingBalance ? (
                <p className="text-gray-400">Loading balance...</p>
              ) : balance ? (
                <>
                  <p className="text-3xl font-bold text-brand-orange mb-2">
                    {formatUnits(balance, 6)} USDC
                  </p>
                  <p className="text-sm text-gray-400">
                    On Arc Network
                  </p>
                </>
              ) : (
                <p className="text-gray-400">No balance found</p>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-6 hover:border-brand-orange/30 transition-colors duration-500">
              <h2 className="text-xl font-semibold font-manrope mb-4 text-white">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/employee/register"
                  className="block p-4 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 hover:border-brand-orange/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Register Sub-ENS</p>
                      <p className="text-sm text-gray-400">
                        Get your employee subdomain
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-orange" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw & Bridge Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-6 hover:border-brand-orange/30 transition-colors duration-500">
            <h2 className="text-xl font-semibold font-manrope mb-6 text-white">Withdraw & Bridge</h2>
            <WithdrawalWidget />
          </div>
        </div>
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </main>
  )
}
