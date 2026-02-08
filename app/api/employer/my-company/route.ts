import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'
import { getCompany } from '@/lib/storage/employees'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerAddress = searchParams.get('ownerAddress')

    if (!ownerAddress) {
      return NextResponse.json(
        { error: 'Missing required parameter: ownerAddress' },
        { status: 400 }
      )
    }

    // In production, this would query a database
    // For now, we'll try to get the company using the getCompany function
    // Note: getCompany expects an ENS name, not an owner address
    // Since we don't have a search function by owner, we'll return null
    // The client should store the company ENS name after registration
    return NextResponse.json({
      success: true,
      company: null,
      message: 'Company lookup by owner not implemented in in-memory storage. Store company ENS name after registration.',
    })
  } catch (error: any) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company', details: error.message },
      { status: 500 }
    )
  }
}
