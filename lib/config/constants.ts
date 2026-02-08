import { Address } from 'viem';

// Contract addresses (update after deployment)
export const PAYROLL_VAULT_ADDRESS = (process.env
  .NEXT_PUBLIC_PAYROLL_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;

// ENS addresses (mainnet)
export const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as Address;
export const ENS_NAME_WRAPPER_ADDRESS = '0x0635513f179D50A207757E05759CbD106d7dFcE8' as Address;

// USDC addresses by chain
export const USDC_ADDRESSES: Record<number, Address> = {
  // Update with actual addresses
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address, // Ethereum mainnet
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address, // Base
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address, // Arbitrum
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' as Address, // Polygon
};
