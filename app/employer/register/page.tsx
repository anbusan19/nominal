import { EmployerRegistration } from '@/components/EmployerRegistration'

export default function EmployerRegisterPage() {
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

      <div className="relative z-10 max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-brand-orange font-mono text-sm tracking-[0.2em] mb-4 inline-block uppercase font-bold px-3 py-1 rounded border border-brand-orange/20 bg-brand-orange/10">
            EMPLOYER REGISTRATION
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-manrope mb-4 text-white">
            Register Your Company
          </h1>
          <p className="text-gray-400 text-lg">
            Register your company and set up your ENS domain for payroll management
          </p>
        </header>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative border border-white/10 bg-[#0A0A0A] rounded-xl p-8 hover:border-brand-orange/30 transition-colors duration-500">
            <EmployerRegistration />
          </div>
        </div>
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </main>
  )
}
