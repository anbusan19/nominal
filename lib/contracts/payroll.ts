import { Address, encodeFunctionData } from 'viem';
import { PAYROLL_VAULT_ABI, ERC20_ABI } from './abis';
import { USDC_ADDRESS } from '../config/chains';

/**
 * Prepare deposit transaction data for PayrollVault
 */
export function prepareDeposit(amount: bigint) {
  return {
    abi: ERC20_ABI,
    address: USDC_ADDRESS,
    functionName: 'approve' as const,
    args: [
      process.env.NEXT_PUBLIC_PAYROLL_VAULT_ADDRESS as Address,
      amount,
    ],
  };
}

/**
 * Prepare batch distribution transaction
 */
export function prepareBatchDistribute(
  recipients: Address[],
  amounts: bigint[]
) {
  if (recipients.length !== amounts.length) {
    throw new Error('Recipients and amounts arrays must have the same length');
  }

  return {
    abi: PAYROLL_VAULT_ABI,
    address: process.env.NEXT_PUBLIC_PAYROLL_VAULT_ADDRESS as Address,
    functionName: 'batchDistribute' as const,
    args: [recipients, amounts],
  };
}

/**
 * Prepare add employee transaction
 */
export function prepareAddEmployee(employeeAddress: Address, ensSubname: string) {
  return {
    abi: PAYROLL_VAULT_ABI,
    address: process.env.NEXT_PUBLIC_PAYROLL_VAULT_ADDRESS as Address,
    functionName: 'addEmployee' as const,
    args: [employeeAddress, ensSubname],
  };
}
