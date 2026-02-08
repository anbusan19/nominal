import { IdentityClaim } from '@/components/Employee/IdentityClaim'
import { WithdrawalWidget } from '@/components/Employee/WithdrawalWidget'
import { EmployeeBalance } from '@/components/Employee/EmployeeBalance'

export default function EmployeePage() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Employee Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Claim your identity and manage your earnings
          </p>
        </header>

        {/* Identity Claim Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your Identity
          </h2>
          <IdentityClaim />
        </div>

        {/* Balance and Withdrawal Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your Earnings
          </h2>
          <EmployeeBalance />
          <div className="mt-6">
            <WithdrawalWidget />
          </div>
        </div>
      </div>
    </main>
  )
}
