'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from './ui/Button'
import { normalizeENSName, resolveENSName } from '@/lib/ens/utils'
import { createPublicClient, http, Address } from 'viem'
import { mainnet } from 'viem/chains'

// ENS Registry ABI for checking availability
const ENS_REGISTRY_ABI = [
  {
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as Address

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

interface CompanyDetails {
  companyName: string
  companyDescription: string
  website: string
  contactEmail: string
  ensDomain: string
}

export function EmployerRegistration() {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState<CompanyDetails>({
    companyName: '',
    companyDescription: '',
    website: '',
    contactEmail: '',
    ensDomain: '',
  })
  const [ensAvailability, setEnsAvailability] = useState<'checking' | 'available' | 'taken' | 'owned' | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyDetails, string>>>({})
  const [success, setSuccess] = useState(false)
  const [existingCompany, setExistingCompany] = useState<any>(null)

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Check for existing company registration on mount
  useEffect(() => {
    if (isConnected && address) {
      checkExistingRegistration()
    }
  }, [isConnected, address])

  const checkExistingRegistration = async () => {
    try {
      const response = await fetch(`/api/employer/register?walletAddress=${address}`)
      if (response.ok) {
        const data = await response.json()
        if (data.companies && data.companies.length > 0) {
          const company = data.companies[0]
          setExistingCompany(company)
          // Pre-fill form with existing data
          setFormData({
            companyName: company.companyName || '',
            companyDescription: company.companyDescription || '',
            website: company.website || '',
            contactEmail: company.contactEmail || '',
            ensDomain: company.ensDomain || '',
          })
        }
      }
    } catch (error) {
      // Ignore errors when checking
      console.error('Error checking existing registration:', error)
    }
  }

  // Check ENS domain availability and ownership
  const checkENSAvailability = async (domain: string) => {
    if (!domain || !domain.endsWith('.eth')) {
      setEnsAvailability(null)
      return
    }

    if (!address) {
      setEnsAvailability(null)
      return
    }

    try {
      setIsCheckingAvailability(true)
      const normalized = normalizeENSName(domain)
      
      // First check via API for ownership verification
      const verifyResponse = await fetch('/api/employer/verify-ens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: normalized,
          address: address,
        }),
      })

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json()
        if (verifyData.isOwner) {
          setEnsAvailability('owned')
          setIsCheckingAvailability(false)
          return
        }
      }

      // Fallback: Check if domain is already resolved (taken)
      const resolvedAddress = await resolveENSName(normalized)
      
      if (resolvedAddress) {
        // Check if the resolved address matches the connected wallet
        if (resolvedAddress.toLowerCase() === address.toLowerCase()) {
          setEnsAvailability('owned')
        } else {
          setEnsAvailability('taken')
        }
      } else {
        // Domain is available for registration
        setEnsAvailability('available')
      }
    } catch (error) {
      console.error('Error checking ENS availability:', error)
      setEnsAvailability('taken') // Assume taken if we can't check
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Debounced ENS availability check
  useEffect(() => {
    if (!formData.ensDomain) {
      setEnsAvailability(null)
      return
    }

    const timer = setTimeout(() => {
      checkENSAvailability(formData.ensDomain)
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.ensDomain])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyDetails, string>> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    if (!formData.ensDomain.trim()) {
      newErrors.ensDomain = 'ENS domain is required'
    } else if (!formData.ensDomain.endsWith('.eth')) {
      newErrors.ensDomain = 'ENS domain must end with .eth'
    } else     if (ensAvailability === 'taken') {
      newErrors.ensDomain = 'This ENS domain is already taken by another address'
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CompanyDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      alert('Please connect your wallet to continue')
      return
    }

    if (!validateForm()) {
      return
    }

    if (ensAvailability !== 'available' && ensAvailability !== 'owned') {
      alert('Please ensure the ENS domain is available or owned by you before registering')
      return
    }

    try {
      setIsSubmitting(true)
      setSuccess(false)

      const normalized = normalizeENSName(formData.ensDomain)

      // Verify ENS ownership before proceeding
      const verifyResponse = await fetch('/api/employer/verify-ens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: normalized,
          address: address,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify ENS ownership')
      }

      const verifyData = await verifyResponse.json()

      if (!verifyData.isOwner && ensAvailability !== 'available') {
        throw new Error('You must own this ENS domain to register your company. Please register it first or use a domain you own.')
      }

      // If domain is owned, optionally set up NameWrapper on-chain
      let txHash: string | null = null
      if (verifyData.isOwner) {
        try {
          // Prepare NameWrapper transaction to ensure domain is wrapped
          const ensTxResponse = await fetch('/api/employer/register-ens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              domain: normalized,
              ownerAddress: address,
            }),
          })

          if (ensTxResponse.ok) {
            const ensTxData = await ensTxResponse.json()
            
            // Execute the transaction using wagmi
            if (ensTxData.transaction) {
              await writeContract({
                address: ensTxData.transaction.to as `0x${string}`,
                abi: [
                  {
                    inputs: [
                      { name: 'parentNode', type: 'bytes32' },
                      { name: 'label', type: 'string' },
                      { name: 'owner', type: 'address' },
                      { name: 'resolver', type: 'address' },
                      { name: 'ttl', type: 'uint64' },
                      { name: 'fuses', type: 'uint32' },
                      { name: 'expiry', type: 'uint64' },
                    ],
                    name: 'setSubnodeRecord',
                    outputs: [],
                    stateMutability: 'nonpayable',
                    type: 'function',
                  },
                ],
                functionName: 'setSubnodeRecord',
                args: [
                  ensTxData.transaction.args?.[0] || '0x',
                  normalized.split('.')[0],
                  address!,
                  '0x0000000000000000000000000000000000000000',
                  BigInt(0),
                  0,
                  BigInt(0),
                ],
                chainId: ensTxData.transaction.chainId,
              })
              
              // Wait for transaction hash
              if (hash) {
                txHash = hash
              }
            }
          }
        } catch (ensError) {
          // If NameWrapper setup fails, continue with registration anyway
          console.warn('Failed to set up NameWrapper, continuing with registration:', ensError)
        }
      }

      // Store company registration
      const registrationData = {
        ...formData,
        ensDomain: normalized,
        walletAddress: address,
        registeredAt: new Date().toISOString(),
        isOwner: verifyData.isOwner,
        ownerChain: verifyData.chain,
        txHash: txHash || hash || null,
      }

      // Store company details via API
      const storeResponse = await fetch('/api/employer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      if (!storeResponse.ok) {
        const errorData = await storeResponse.json()
        
        // Handle 409 Conflict - company already exists
        if (storeResponse.status === 409) {
          // Check if user wants to update existing registration
          const shouldUpdate = confirm(
            `${errorData.error}\n\n` +
            `Would you like to update your existing company registration?`
          )
          
          if (shouldUpdate) {
            // Update existing registration
            const updateResponse = await fetch('/api/employer/register', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(registrationData),
            })
            
            if (!updateResponse.ok) {
              const updateError = await updateResponse.json()
              throw new Error(updateError.error || 'Failed to update company registration')
            }
            
            // Success - company updated
            setSuccess(true)
            setIsSubmitting(false)
            return
          } else {
            setIsSubmitting(false)
            return
          }
        }
        
        throw new Error(errorData.error || 'Failed to register company')
      }

      const storeData = await storeResponse.json()

      // If domain is available, show message about needing to register it first
      if (ensAvailability === 'available') {
        alert(
          `Domain ${normalized} is available but not yet registered. ` +
          `Please register it through the ENS app (app.ens.domains) first, then come back to complete your company registration.`
        )
        setIsSubmitting(false)
        return
      }

      // Success - company registered
      setSuccess(true)
      setIsSubmitting(false)

    } catch (error: any) {
      console.error('Error registering company:', error)
      alert(error.message || 'Failed to register company. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          Wallet Not Connected
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Please connect your wallet to register your company
        </p>
      </div>
    )
  }

  // Show existing registration notice (but allow editing)
  if (existingCompany && !success && !isSubmitting) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Existing Registration Found
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
            You already have a company registered with this wallet address. You can update your information below.
          </p>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400 mb-4">
            <p><strong>Company:</strong> {existingCompany.companyName}</p>
            <p><strong>ENS Domain:</strong> {existingCompany.ensDomain}</p>
            <p><strong>Registered:</strong> {new Date(existingCompany.registeredAt).toLocaleDateString()}</p>
          </div>
          <Button
            onClick={() => setExistingCompany(null)}
            variant="primary"
            className="w-full"
          >
            Update Registration
          </Button>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Form is pre-filled with your existing registration. Make changes and click "Register Company & ENS Domain" to update.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your company has been registered with ENS domain: <span className="font-mono font-semibold">{formData.ensDomain}</span>
        </p>
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <p><strong>Company:</strong> {formData.companyName}</p>
          <p><strong>ENS Domain:</strong> {formData.ensDomain}</p>
          <p><strong>Wallet:</strong> <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span></p>
        </div>
        <div className="flex gap-4 justify-center">
          <a href="/admin">
            <Button variant="primary">
              Go to Dashboard
            </Button>
          </a>
          <Button 
            variant="outline"
            onClick={() => {
              setSuccess(false)
              setFormData({
                companyName: '',
                companyDescription: '',
                website: '',
                contactEmail: '',
                ensDomain: '',
              })
            }}
          >
            Register Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="companyName"
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          placeholder="Acme Corporation"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.companyName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
        )}
      </div>

      <div>
        <label htmlFor="companyDescription" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Company Description
        </label>
        <textarea
          id="companyDescription"
          value={formData.companyDescription}
          onChange={(e) => handleInputChange('companyDescription', e.target.value)}
          placeholder="Brief description of your company..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Website URL
        </label>
        <input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          placeholder="https://example.com"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.website ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-500">{errors.website}</p>
        )}
      </div>

      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
          placeholder="contact@company.com"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.contactEmail ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.contactEmail && (
          <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>
        )}
      </div>

      <div>
        <label htmlFor="ensDomain" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          ENS Domain <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="ensDomain"
            type="text"
            value={formData.ensDomain}
            onChange={(e) => handleInputChange('ensDomain', e.target.value)}
            placeholder="company.eth"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono ${
              errors.ensDomain ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {isCheckingAvailability && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        {errors.ensDomain && (
          <p className="mt-1 text-sm text-red-500">{errors.ensDomain}</p>
        )}
        {ensAvailability === 'available' && !errors.ensDomain && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Domain is available for registration
          </p>
        )}
        {ensAvailability === 'owned' && !errors.ensDomain && (
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            You own this domain - you can use it
          </p>
        )}
        {ensAvailability === 'taken' && !errors.ensDomain && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Domain is already taken by another address
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          This will be your company's primary ENS domain (e.g., company.eth). Employees will receive subnames like alice.company.eth
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isConfirming || (ensAvailability !== 'available' && ensAvailability !== 'owned')}
          className="w-full py-3 text-lg"
        >
          {isSubmitting || isConfirming ? 'Registering...' : 'Register Company & ENS Domain'}
        </Button>
        {txSuccess && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400 text-center">
            Transaction confirmed! Processing registration...
          </p>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> ENS domain registration requires payment in ETH. Make sure you have sufficient funds in your connected wallet. 
          After registration, you'll be able to create employee subnames and manage your payroll treasury.
        </p>
      </div>
    </form>
  )
}
