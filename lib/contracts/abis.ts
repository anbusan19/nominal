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

// ENS ETH Registrar Controller ABI
export const ENS_ETH_REGISTRAR_CONTROLLER_ABI = parseAbi([
  'function commit(bytes32 commitment)',
  'function register(string name, address owner, uint256 duration, bytes32 secret) payable',
  'function rentPrice(string name, uint256 duration) view returns (uint256)',
  'function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) pure returns (bytes32)',
  'function commitments(bytes32 commitment) view returns (uint256)',
]);

// ENS NameWrapper ABI (extended)
export const ENS_NAME_WRAPPER_ABI = parseAbi([
  'function wrapETH2LD(string label, address wrappedOwner, uint16 fuses, uint64 expiry, address resolver) payable returns (uint64)',
  'function setSubnodeRecord(bytes32 parentNode, string label, address owner, address resolver, uint64 ttl, uint32 fuses, uint64 expiry)',
  'function setSubnodeOwner(bytes32 parentNode, string label, address owner) returns (bytes32)',
  'function ownerOf(uint256 id) view returns (address)',
  'function getData(uint256 id) view returns (address owner, address resolver, uint64 ttl, uint64 expiry, uint32 fuses)',
]);