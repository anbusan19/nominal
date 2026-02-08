import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { resolveENSName, reverseResolve } from '../ens/utils'

/**
 * Hook to resolve ENS names and reverse resolve addresses
 */
export function useENS() {
  const { address } = useAccount()
  const [ensName, setEnsName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (address) {
      setIsLoading(true)
      reverseResolve(address)
        .then((name) => {
          setEnsName(name)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }, [address])

  const resolveName = async (name: string) => {
    setIsLoading(true)
    try {
      const resolved = await resolveENSName(name)
      setIsLoading(false)
      return resolved
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  return {
    ensName,
    resolveName,
    isLoading,
  }
}
