import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'
import { createCompany } from '@/lib/storage/employees'

interface RegisterCompanyRequest {
  ensName: string
  ownerAddress: Address
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterCompanyRequest = await request.json()
    const { ensName, ownerAddress } = body

    if (!ensName || !ownerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: ensName, ownerAddress' },
        { status: 400 }
      )
    }

    // Normalize ENS name
    const normalized = ensName.toLowerCase().replace(/\.eth$/, '') + '.eth'

    const company = createCompany(normalized, ownerAddress)

    return NextResponse.json({
      success: true,
      company,
    })
  } catch (error: any) {
    console.error('Error registering company:', error)
    return NextResponse.json(
      { error: 'Failed to register company', details: error.message },
      { status: 500 }
    )
  }
}
