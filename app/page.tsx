import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Building2, User } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[100vw] h-[100vw] max-w-[2000px] max-h-[2000px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-brand-orange/10 blur-[150px] rounded-full" />
        </div>
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Companies Card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-8 hover:border-brand-orange/30 transition-colors duration-500">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h2 className="text-3xl font-bold font-manrope text-white mb-2">
                    For Companies
                  </h2>
                  <p className="text-gray-400">
                    Manage your treasury and execute global payroll with Circle and ENS
                  </p>
                </div>
                <div className="space-y-3">
                  <Link href="/employer/register" className="block">
                    <Button className="w-full py-4 text-lg bg-brand-orange hover:bg-red-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(232,65,66,0.3)] hover:shadow-[0_0_30px_rgba(232,65,66,0.5)]">
                      Register Company
                    </Button>
                  </Link>
                  <Link href="/admin" className="block">
                    <Button className="w-full py-3 text-base bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30">
                      Manage Treasury
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* For Talent Card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-8 hover:border-brand-orange/30 transition-colors duration-500">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h2 className="text-3xl font-bold font-manrope text-white mb-2">
                    For Talent
                  </h2>
                  <h2 className="text-3xl font-bold font-manrope text-white mb-2">
                    
                  </h2>
                  <h2 className="text-3xl font-bold font-manrope text-white mb-2">
                    
                  </h2>
                  <p className="text-gray-400">
                    Claim your ENS identity and withdraw your pay with LI.FI
                  </p>
                </div>
                <Link href="/employee" className="block">
                  <Button className="w-full py-4 text-lg bg-brand-orange hover:bg-red-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(232,65,66,0.3)] hover:shadow-[0_0_30px_rgba(232,65,66,0.5)]">
                    Claim Pay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </main>
  )
}
