// Simple in-memory storage for employees
// In production, replace with a proper database

export interface Employee {
  id: string
  walletAddress: string
  subEnsName: string // e.g., "alice.company.eth"
  companyEnsName: string // e.g., "company.eth"
  name?: string
  email?: string
  createdAt: number
}

export interface Company {
  ensName: string
  ownerAddress: string
  treasuryAddress?: string
  employees: Employee[]
  createdAt: number
}

// In-memory storage (replace with database in production)
const companies = new Map<string, Company>()
const employees = new Map<string, Employee>()

export function getCompany(ensName: string): Company | null {
  return companies.get(ensName.toLowerCase()) || null
}

export function createCompany(ensName: string, ownerAddress: string): Company {
  const normalized = ensName.toLowerCase()
  const company: Company = {
    ensName: normalized,
    ownerAddress,
    employees: [],
    createdAt: Date.now(),
  }
  companies.set(normalized, company)
  return company
}

export function addEmployee(companyEnsName: string, employee: Omit<Employee, 'id' | 'createdAt'>): Employee {
  const company = getCompany(companyEnsName)
  if (!company) {
    throw new Error(`Company ${companyEnsName} not found`)
  }

  const fullEmployee: Employee = {
    ...employee,
    id: `${companyEnsName}-${employee.walletAddress}`,
    createdAt: Date.now(),
  }

  employees.set(fullEmployee.id, fullEmployee)
  company.employees.push(fullEmployee)
  companies.set(companyEnsName.toLowerCase(), company)

  return fullEmployee
}

export function getEmployee(employeeId: string): Employee | null {
  return employees.get(employeeId) || null
}

export function getEmployeesByCompany(companyEnsName: string): Employee[] {
  const company = getCompany(companyEnsName)
  return company?.employees || []
}

export function updateCompanyTreasury(companyEnsName: string, treasuryAddress: string): void {
  const company = getCompany(companyEnsName)
  if (company) {
    company.treasuryAddress = treasuryAddress
    companies.set(companyEnsName.toLowerCase(), company)
  }
}
