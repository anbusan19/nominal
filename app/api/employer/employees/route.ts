import { NextRequest, NextResponse } from 'next/server'
import { getCompany, getEmployeesByCompany } from '@/lib/storage/employees'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyEnsName = searchParams.get('companyEnsName')

    if (!companyEnsName) {
      return NextResponse.json(
        { error: 'Missing required parameter: companyEnsName' },
        { status: 400 }
      )
    }

    const company = getCompany(companyEnsName)
    if (!company) {
      return NextResponse.json(
        { error: `Company ${companyEnsName} not found` },
        { status: 404 }
      )
    }

    const employees = getEmployeesByCompany(companyEnsName)

    return NextResponse.json({
      success: true,
      company,
      employees,
    })
  } catch (error: any) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees', details: error.message },
      { status: 500 }
    )
  }
}
