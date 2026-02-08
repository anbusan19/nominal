import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

interface CompanyRegistration {
  companyName: string
  companyDescription: string
  website: string
  contactEmail: string
  ensDomain: string
  walletAddress: string
  registeredAt: string
  isOwner: boolean
  ownerChain?: string
}

const COMPANIES_FILE = join(process.cwd(), 'data', 'companies.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await mkdir(join(process.cwd(), 'data'), { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

// Read existing companies
async function readCompanies(): Promise<CompanyRegistration[]> {
  try {
    await ensureDataDir()
    const data = await readFile(COMPANIES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Write companies to file
async function writeCompanies(companies: CompanyRegistration[]) {
  await ensureDataDir()
  await writeFile(COMPANIES_FILE, JSON.stringify(companies, null, 2), 'utf-8')
}

export async function POST(request: NextRequest) {
  try {
    const body: CompanyRegistration = await request.json()

    // Validate required fields
    if (!body.companyName || !body.ensDomain || !body.walletAddress || !body.contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: companyName, ensDomain, walletAddress, contactEmail' },
        { status: 400 }
      )
    }

    // Read existing companies
    const companies = await readCompanies()

    // Check if company already exists (by ENS domain or wallet)
    const existingIndex = companies.findIndex(
      (c) => c.ensDomain.toLowerCase() === body.ensDomain.toLowerCase() ||
             c.walletAddress.toLowerCase() === body.walletAddress.toLowerCase()
    )

    if (existingIndex !== -1) {
      return NextResponse.json(
        { 
          error: 'Company already registered with this ENS domain or wallet address',
          existing: companies[existingIndex],
        },
        { status: 409 }
      )
    }

    // Add new company
    companies.push(body)

    // Write back to file
    await writeCompanies(companies)

    return NextResponse.json({
      success: true,
      message: 'Company registered successfully',
      company: {
        companyName: body.companyName,
        ensDomain: body.ensDomain,
        walletAddress: body.walletAddress,
      },
    })
  } catch (error: any) {
    console.error('Error registering company:', error)
    return NextResponse.json(
      { 
        error: 'Failed to register company',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// PUT endpoint to update existing company
export async function PUT(request: NextRequest) {
  try {
    const body: CompanyRegistration = await request.json()

    // Validate required fields
    if (!body.companyName || !body.ensDomain || !body.walletAddress || !body.contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: companyName, ensDomain, walletAddress, contactEmail' },
        { status: 400 }
      )
    }

    // Read existing companies
    const companies = await readCompanies()

    // Find existing company
    const existingIndex = companies.findIndex(
      (c) => c.ensDomain.toLowerCase() === body.ensDomain.toLowerCase() ||
             c.walletAddress.toLowerCase() === body.walletAddress.toLowerCase()
    )

    if (existingIndex === -1) {
      return NextResponse.json(
        { error: 'Company not found. Please register first.' },
        { status: 404 }
      )
    }

    // Update company data
    companies[existingIndex] = {
      ...companies[existingIndex],
      ...body,
      registeredAt: companies[existingIndex].registeredAt, // Keep original registration date
      updatedAt: new Date().toISOString(),
    }

    // Write back to file
    await writeCompanies(companies)

    return NextResponse.json({
      success: true,
      message: 'Company updated successfully',
      company: companies[existingIndex],
    })
  } catch (error: any) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update company',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    const ensDomain = searchParams.get('ensDomain')

    const companies = await readCompanies()

    // Filter by wallet address or ENS domain if provided
    let filteredCompanies = companies
    if (walletAddress) {
      filteredCompanies = filteredCompanies.filter(
        (c) => c.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      )
    }
    if (ensDomain) {
      filteredCompanies = filteredCompanies.filter(
        (c) => c.ensDomain.toLowerCase() === ensDomain.toLowerCase()
      )
    }

    return NextResponse.json({
      success: true,
      companies: filteredCompanies,
      count: filteredCompanies.length,
    })
  } catch (error: any) {
    console.error('Error retrieving companies:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve companies',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
