import Link from 'next/link'
import { WalletButton } from '@/components/WalletButton'
import { CorporateOnboarding } from '@/components/CorporateOnboarding'
import { EmployeeProvisioning } from '@/components/EmployeeProvisioning'
import { PayrollManagement } from '@/components/PayrollManagement'
import { EmployeeWithdrawal } from '@/components/EmployeeWithdrawal'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Nominal</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sovereign Payroll Infrastructure
              </p>
            </div>
            <WalletButton />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Corporate Onboarding</h2>
            <CorporateOnboarding />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Employee Provisioning</h2>
            <EmployeeProvisioning />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Payroll Management</h2>
            <PayrollManagement />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Employee Withdrawal</h2>
            <EmployeeWithdrawal />
          </div>
        </div>
      </div>
    </main>
  )
}
