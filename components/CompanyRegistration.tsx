'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { sepolia } from 'viem/chains'
import { 
  ENS_ETH_REGISTRAR_CONTROLLER, 
  ENS_NAME_WRAPPER_ADDRESS,
  ENS_PUBLIC_RESOLVER,
  ENS_CHAIN_ID 
} from '@/lib/config/constants'
import { ENS_ETH_REGISTRAR_CONTROLLER_ABI, ENS_NAME_WRAPPER_ABI } from '@/lib/contracts/abis'
import { namehash, encodeLabelhash, randomBytes, keccak256, toHex, createPublicClient, http } from 'viem'
import { normalizeENSName } from '@/lib/ens/utils'

type Step = 'commit' | 'wait' | 'register' | 'wrap' | 'complete'

interface RegistrationData {
  name: string
  secret: `0x${string}`
  commitment: `0x${string}`
  commitTimestamp: number
}

const COMMIT_WAIT_TIME = 60 // 60 seconds

export function CompanyRegistration() {
  const { address, isConnected, chainId } = useAccount()
  const [step, setStep] = useState<Step>('commit')
  const [domainName, setDomainName] = useState('')
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [registeredDomain, setRegisteredDomain] = useState<string | null>(null)

  // Wagmi hooks for commit transaction
  const { 
    writeContract: writeCommit, 
    data: commitHash, 
    isPending: isCommitting 
  } = useWriteContract()
  
  const { 
    isLoading: isCommitConfirming, 
    isSuccess: isCommitSuccess 
  } = useWaitForTransactionReceipt({
    hash: commitHash,
    chainId: ENS_CHAIN_ID,
  })

  // Wagmi hooks for register transaction
  const { 
    writeContract: writeRegister, 
    data: registerHash, 
    isPending: isRegistering 
  } = useWriteContract()
  
  const { 
    isLoading: isRegisterConfirming, 
    isSuccess: isRegisterSuccess 
  } = useWaitForTransactionReceipt({
    hash: registerHash,
    chainId: ENS_CHAIN_ID,
  })

  // Wagmi hooks for wrap transaction
  const { 
    writeContract: writeWrap, 
    data: wrapHash, 
    isPending: isWrapping 
  } = useWriteContract()
  
  const { 
    isLoading: isWrapConfirming, 
    isSuccess: isWrapSuccess 
  } = useWaitForTransactionReceipt({
    hash: wrapHash,
    chainId: ENS_CHAIN_ID,
  })

  // Read rent price
  const { data: rentPrice, isLoading: isLoadingPrice } = useReadContract({
    address: ENS_ETH_REGISTRAR_CONTROLLER,
    abi: ENS_ETH_REGISTRAR_CONTROLLER_ABI,
    functionName: 'rentPrice',
    args: domainName ? [domainName, BigInt(31536000)] : undefined, // 1 year duration
    chainId: ENS_CHAIN_ID,
    query: {
      enabled: step === 'register' && !!domainName,
    },
  })

  // Load registration data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ens_registration_data')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const data: RegistrationData = {
          name: parsed.name,
          secret: parsed.secret as `0x${string}`,
          commitment: parsed.commitment as `0x${string}`,
          commitTimestamp: parsed.commitTimestamp,
        }
        const now = Math.floor(Date.now() / 1000)
        const elapsed = now - data.commitTimestamp
        
        if (elapsed < COMMIT_WAIT_TIME) {
          // Still in wait period
          setRegistrationData(data)
          setDomainName(data.name)
          setStep('wait')
          setCountdown(COMMIT_WAIT_TIME - elapsed)
        } else if (elapsed < COMMIT_WAIT_TIME + 86400) {
          // Wait period passed, can register (within 24 hours)
          setRegistrationData(data)
          setDomainName(data.name)
          setStep('register')
        } else {
          // Expired, clear storage
          localStorage.removeItem('ens_registration_data')
        }
      } catch (e) {
        console.error('Error loading registration data:', e)
        localStorage.removeItem('ens_registration_data')
      }
    }
  }, [])

  // Countdown timer effect
  useEffect(() => {
    if (step === 'wait' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setStep('register')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, countdown])

  // Handle commit success
  useEffect(() => {
    if (isCommitSuccess && registrationData) {
      setStep('wait')
      setCountdown(COMMIT_WAIT_TIME)
    }
  }, [isCommitSuccess, registrationData])

  // Handle register success
  useEffect(() => {
    if (isRegisterSuccess && domainName) {
      setRegisteredDomain(domainName)
      setStep('wrap')
      // Clear localStorage after successful registration
      localStorage.removeItem('ens_registration_data')
    }
  }, [isRegisterSuccess, domainName])

  // Handle wrap success
  useEffect(() => {
    if (isWrapSuccess) {
      // Register company in our system
      if (registeredDomain && address) {
        fetch('/api/employer/register-company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ensName: registeredDomain,
            ownerAddress: address,
          }),
        })
          .then(() => {
            // Store company ENS name in localStorage
            localStorage.setItem(`company_ens_${address}`, registeredDomain)
          })
          .catch(console.error)
      }
      setStep('complete')
    }
  }, [isWrapSuccess, registeredDomain, address])

  const handleCommit = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    if (chainId !== ENS_CHAIN_ID) {
      setError(`Please switch to Sepolia network (Chain ID: ${ENS_CHAIN_ID})`)
      return
    }

    if (!domainName.trim()) {
      setError('Please enter a domain name')
      return
    }

    try {
      const normalized = normalizeENSName(domainName)
      // Ensure it's just the label (without .eth)
      const label = normalized.replace('.eth', '')
      
      if (!label || label.length === 0) {
        setError('Invalid domain name')
        return
      }

      setError(null)

      // Generate random secret (32 bytes)
      const secret = randomBytes(32) as `0x${string}`
      
      // Generate commitment using makeCommitment function from the contract
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      })

      const commitment = await publicClient.readContract({
        address: ENS_ETH_REGISTRAR_CONTROLLER,
        abi: ENS_ETH_REGISTRAR_CONTROLLER_ABI,
        functionName: 'makeCommitment',
        args: [
          label,
          address,
          BigInt(31536000), // 1 year duration
          secret,
          '0x0000000000000000000000000000000000000000' as `0x${string}`, // resolver
          [], // data
          false, // reverseRecord
          0, // ownerControlledFuses
        ],
      })

      // Save to localStorage (store secret as hex string)
      const data: RegistrationData = {
        name: label,
        secret,
        commitment,
        commitTimestamp: Math.floor(Date.now() / 1000),
      }
      // Store in localStorage with secret as string
      localStorage.setItem('ens_registration_data', JSON.stringify({
        name: data.name,
        secret: secret, // hex string
        commitment: commitment,
        commitTimestamp: data.commitTimestamp,
      }))
      setRegistrationData(data)

      // Call commit
      await writeCommit({
        address: ENS_ETH_REGISTRAR_CONTROLLER,
        abi: ENS_ETH_REGISTRAR_CONTROLLER_ABI,
        functionName: 'commit',
        args: [commitment],
        chainId: ENS_CHAIN_ID,
      })
    } catch (err: any) {
      console.error('Error committing:', err)
      setError(err.message || 'Failed to commit registration')
    }
  }

  const handleRegister = async () => {
    if (!isConnected || !address || !registrationData) {
      setError('Missing registration data')
      return
    }

    if (chainId !== ENS_CHAIN_ID) {
      setError(`Please switch to Sepolia network (Chain ID: ${ENS_CHAIN_ID})`)
      return
    }

    if (countdown > 0) {
      setError('Please wait for the countdown to finish')
      return
    }

    try {
      setError(null)

      if (!rentPrice) {
        setError('Failed to fetch registration price')
        return
      }

      // Add 10% slippage
      const priceWithSlippage = (rentPrice * BigInt(110)) / BigInt(100)

      // Call register
      await writeRegister({
        address: ENS_ETH_REGISTRAR_CONTROLLER,
        abi: ENS_ETH_REGISTRAR_CONTROLLER_ABI,
        functionName: 'register',
        args: [
          registrationData.name,
          address,
          BigInt(31536000), // 1 year duration
          registrationData.secret,
        ],
        value: priceWithSlippage,
        chainId: ENS_CHAIN_ID,
      })
    } catch (err: any) {
      console.error('Error registering:', err)
      setError(err.message || 'Failed to register domain')
    }
  }

  const handleWrap = async () => {
    if (!isConnected || !address || !registeredDomain) {
      setError('Missing domain information')
      return
    }

    if (chainId !== ENS_CHAIN_ID) {
      setError(`Please switch to Sepolia network (Chain ID: ${ENS_CHAIN_ID})`)
      return
    }

    try {
      setError(null)

      // Extract label from domain (e.g., "company" from "company.eth")
      const label = registeredDomain.replace('.eth', '')

      // Wrap the domain using wrapETH2LD
      await writeWrap({
        address: ENS_NAME_WRAPPER_ADDRESS,
        abi: ENS_NAME_WRAPPER_ABI,
        functionName: 'wrapETH2LD',
        args: [
          label,
          address, // wrappedOwner
          0, // fuses (0 = no restrictions)
          BigInt(0), // expiry (0 = no expiry)
          ENS_PUBLIC_RESOLVER, // resolver
        ],
        chainId: ENS_CHAIN_ID,
      })
    } catch (err: any) {
      console.error('Error wrapping domain:', err)
      setError(err.message || 'Failed to wrap domain')
    }
  }

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Please connect your wallet to register a domain
        </p>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          ✅ Registration Complete!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Your domain <span className="font-mono font-semibold">{registeredDomain}</span> has been registered and wrapped.
          You can now issue subnames to employees.
        </p>
        {wrapHash && (
          <p className="text-xs text-green-600 dark:text-green-400 font-mono break-all">
            Wrap TX: {wrapHash}
          </p>
        )}
        <Button
          onClick={() => {
            setStep('commit')
            setDomainName('')
            setRegistrationData(null)
            setRegisteredDomain(null)
            setError(null)
          }}
          variant="outline"
          className="mt-4"
        >
          Register Another Domain
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Register Company Domain</h2>
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex-1 h-2 rounded-full ${
            step === 'commit' ? 'bg-blue-500' : 'bg-green-500'
          }`} />
          <div className={`flex-1 h-2 rounded-full ${
            step === 'wait' ? 'bg-blue-500' : step === 'register' || step === 'wrap' || step === 'complete' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          <div className={`flex-1 h-2 rounded-full ${
            step === 'register' ? 'bg-blue-500' : step === 'wrap' || step === 'complete' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          <div className={`flex-1 h-2 rounded-full ${
            step === 'wrap' ? 'bg-blue-500' : step === 'complete' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Commit</span>
          <span>Wait</span>
          <span>Register</span>
          <span>Wrap</span>
        </div>
      </div>

      {step === 'commit' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Domain Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domainName}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                  setDomainName(value)
                  setError(null)
                }}
                placeholder="company"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isCommitting || isCommitConfirming}
              />
              <span className="self-center text-gray-500 dark:text-gray-400">
                .eth
              </span>
            </div>
            {domainName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                You will register: <span className="font-mono">{domainName}.eth</span>
              </p>
            )}
          </div>

          <Button
            onClick={handleCommit}
            disabled={!domainName || isCommitting || isCommitConfirming}
            variant="primary"
            className="w-full"
          >
            {isCommitting || isCommitConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isCommitting ? 'Signing...' : 'Confirming...'}
              </span>
            ) : (
              'Step 1: Commit Registration'
            )}
          </Button>
        </div>
      )}

      {step === 'wait' && (
        <div className="space-y-4">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Waiting Period
            </p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {countdown}s
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Please wait before proceeding to registration. This prevents front-running.
            </p>
          </div>
          {countdown === 0 && (
            <Button
              onClick={() => setStep('register')}
              variant="primary"
              className="w-full"
            >
              Proceed to Registration
            </Button>
          )}
        </div>
      )}

      {step === 'register' && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Registering: <span className="font-mono font-semibold">{registrationData?.name}.eth</span>
            </p>
            {isLoadingPrice ? (
              <p className="text-xs text-gray-500">Loading price...</p>
            ) : rentPrice ? (
              <p className="text-xs text-gray-500">
                Price: {(Number(rentPrice) / 1e18).toFixed(4)} ETH
                <br />
                With 10% slippage: {(Number(rentPrice) * 1.1 / 1e18).toFixed(4)} ETH
              </p>
            ) : null}
          </div>

          <Button
            onClick={handleRegister}
            disabled={isRegistering || isRegisterConfirming || isLoadingPrice || countdown > 0}
            variant="primary"
            className="w-full"
          >
            {isRegistering || isRegisterConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isRegistering ? 'Signing...' : 'Confirming...'}
              </span>
            ) : (
              'Step 3: Register Domain'
            )}
          </Button>
        </div>
      )}

      {step === 'wrap' && (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Important: Wrapping Required
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Your domain must be wrapped to support subnames. This is the final step.
            </p>
          </div>

          <Button
            onClick={handleWrap}
            disabled={isWrapping || isWrapConfirming}
            variant="primary"
            className="w-full"
          >
            {isWrapping || isWrapConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isWrapping ? 'Signing...' : 'Confirming...'}
              </span>
            ) : (
              'Step 4: Wrap Domain'
            )}
          </Button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {commitHash && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
            Commit TX: {commitHash}
          </p>
        </div>
      )}

      {registerHash && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
            Register TX: {registerHash}
          </p>
        </div>
      )}
    </div>
  )
}
