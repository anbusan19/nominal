import { EmployeeTable } from '@/components/Admin/EmployeeTable'
import { PayrollButton } from '@/components/Admin/PayrollButton'
import { TreasuryBalance } from '@/components/Admin/TreasuryBalance'
import { Database } from 'lucide-react'

export default function AdminPage() {
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

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="text-brand-orange font-mono text-sm tracking-[0.2em] mb-4 inline-block uppercase font-bold px-3 py-1 rounded border border-brand-orange/20 bg-brand-orange/10">
            EMPLOYER COMMAND CENTER
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-manrope mb-4 text-white">
            Treasury & Payroll
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your treasury and execute global payroll
          </p>
        </header>

        {/* Treasury Balance Card */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-6 hover:border-brand-orange/30 transition-colors duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Treasury Balance
                </p>
                <TreasuryBalance />
              </div>
              <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-brand-orange" />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Roster */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-6 hover:border-brand-orange/30 transition-colors duration-500">
            <h2 className="text-2xl font-semibold font-manrope mb-6 text-white">
              The Roster
            </h2>
            <EmployeeTable />
          </div>
        </div>

        {/* Payroll Execution */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-6 hover:border-brand-orange/30 transition-colors duration-500">
            <h2 className="text-2xl font-semibold font-manrope mb-6 text-white">
              Execute Payroll
            </h2>
            <PayrollButton />
          </div>
        </div>
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </main>
  )
}
