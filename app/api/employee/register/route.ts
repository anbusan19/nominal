import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'
import { getCompany, addEmployee } from '@/lib/storage/employees'
import { normalizeENSName } from '@/lib/ens/utils'

interface RegisterEmployeeRequest {
  companyEnsName: string
  walletAddress: Address
  label: string // e.g., "alice" for alice.company.eth
  name?: string
  email?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterEmployeeRequest = await request.json()
    const { companyEnsName, walletAddress, label, name, email } = body

    if (!companyEnsName || !walletAddress || !label) {
      return NextResponse.json(
        { error: 'Missing required fields: companyEnsName, walletAddress, label' },
        { status: 400 }
      )
    }

    // Verify company exists
    const company = getCompany(companyEnsName)
    if (!company) {
      return NextResponse.json(
        { error: `Company ${companyEnsName} not found` },
        { status: 404 }
      )
    }

    // Normalize label
    const normalizedLabel = label.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
    const subEnsName = `${normalizedLabel}.${company.ensName}`

    // Check if employee already exists
    const existingEmployee = company.employees.find(
      (emp) => emp.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    )

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee already registered with this wallet address' },
        { status: 400 }
      )
    }

    // Add employee to storage
    const employee = addEmployee(companyEnsName, {
      walletAddress,
      subEnsName,
      companyEnsName,
      name,
      email,
    })

    return NextResponse.json({
      success: true,
      employee,
      message: `Employee registered. Sub-ENS: ${subEnsName}`,
    })
  } catch (error: any) {
    console.error('Error registering employee:', error)
    return NextResponse.json(
      { error: 'Failed to register employee', details: error.message },
      { status: 500 }
    )
  }
}
