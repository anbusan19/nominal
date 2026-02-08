import { useReadContract, useWriteContract } from 'wagmi'
import { PAYROLL_VAULT_ABI } from '../contracts/abis'
import { PAYROLL_VAULT_ADDRESS } from '../config/constants'

/**
 * Hook to interact with PayrollVault contract
 */
export function usePayrollVault() {
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: PAYROLL_VAULT_ADDRESS,
    abi: PAYROLL_VAULT_ABI,
    functionName: 'balance',
  })

  const { data: employeeCount } = useReadContract({
    address: PAYROLL_VAULT_ADDRESS,
    abi: PAYROLL_VAULT_ABI,
    functionName: 'getEmployeeCount',
  })

  const { writeContract, isPending } = useWriteContract()

  return {
    balance,
    employeeCount,
    refetchBalance,
    writeContract,
    isPending,
  }
}
