'use client'

import { EmployeeRegistration } from '@/components/EmployeeRegistration'

export default function EmployeeRegisterPage() {
  // For now, using a hardcoded company ENS name
  // In production, this would come from a query parameter or selection
  const companyEnsName = 'company.eth' // This should be dynamic

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <EmployeeRegistration companyEnsName={companyEnsName} />
      </div>
    </div>
  )
}
