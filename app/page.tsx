import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl w-full px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Nominal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Sovereign Payroll Infrastructure
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Choose your path in the decentralized payroll ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Companies Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-blue-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                For Companies
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your treasury and execute global payroll with Circle and ENS
              </p>
            </div>
            <Link href="/admin" className="block">
              <Button className="w-full py-4 text-lg" variant="primary">
                Manage Treasury
              </Button>
            </Link>
          </div>

          {/* For Talent Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-indigo-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                For Talent
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Claim your ENS identity and withdraw your pay with LI.FI
              </p>
            </div>
            <Link href="/employee" className="block">
              <Button className="w-full py-4 text-lg" variant="primary">
                Claim Pay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
