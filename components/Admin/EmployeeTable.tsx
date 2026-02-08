'use client'

import employeesData from '@/lib/employees.json'

interface Employee {
  name: string
  ensSubname: string
  walletAddress: string
  salary: number
}

export function EmployeeTable() {
  const employees = employeesData as Employee[]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
              Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
              ENS Subname
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
              Wallet Address
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
              Salary (USDC)
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-900 dark:text-white">
                {employee.name}
              </td>
              <td className="py-3 px-4">
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                  {employee.ensSubname}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                  {employee.walletAddress.slice(0, 6)}...{employee.walletAddress.slice(-4)}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                {employee.salary.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
