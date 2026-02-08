import { EmployerRegistration } from '@/components/EmployerRegistration'

export default function EmployerRegisterPage() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Employer Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Register your company and set up your ENS domain for payroll management
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <EmployerRegistration />
        </div>
      </div>
    </main>
  )
}
