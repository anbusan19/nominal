import { parseAbi } from 'viem';

// PayrollVault ABI
export const PAYROLL_VAULT_ABI = parseAbi([
  'function deposit(uint256 amount)',
  'function batchDistribute(address[] recipients, uint256[] amounts)',
  'function balance() view returns (uint256)',
  'function owner() view returns (address)',
  'function addEmployee(address employee, string ensSubname)',
  'function removeEmployee(address employee)',
  'function getEmployeeCount() view returns (uint256)',
  'function getEmployee(uint256 index) view returns (address, string)',
  'event EmployeeAdded(address indexed employee, string ensSubname)',
  'event EmployeeRemoved(address indexed employee)',
  'event PayrollDistributed(address indexed recipient, uint256 amount)',
]);

// ERC20 (USDC) ABI
export const ERC20_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]);
