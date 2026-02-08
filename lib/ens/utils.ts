import { createPublicClient, http, Address, namehash, parseAbi } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export const ENS_REGISTRY = (process.env.NEXT_PUBLIC_ENS_REGISTRY ||
  '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e') as Address;

export const ENS_NAME_WRAPPER = (process.env.NEXT_PUBLIC_ENS_NAME_WRAPPER ||
  '0x0635513f179D50A207757E05759CbD106d7dFcE8') as Address;

// ENS Registry ABI for owner lookup
const ENS_REGISTRY_ABI = parseAbi([
  'function owner(bytes32 node) view returns (address)',
  'function resolver(bytes32 node) view returns (address)',
]);

// Public client for ENS resolution (mainnet)
export const ensClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Public client for ENS operations on Sepolia (for NameWrapper)
export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

/**
 * Normalize an ENS name
 * Simple normalization: lowercase and trim
 * For production, consider using @ensdomains/ensjs normalize function
 */
export function normalizeENSName(name: string): string {
  try {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid ENS name: name must be a non-empty string');
    }
    // Basic normalization: lowercase and trim
    // This is a simplified version - for full ENS normalization, 
    // you would need to handle Unicode normalization (NFD) and other rules
    const normalized = name.toLowerCase().trim();
    
    // Basic validation
    if (!normalized || normalized.length === 0) {
      throw new Error('Invalid ENS name: name cannot be empty');
    }
    
    // Ensure it ends with .eth if it's a domain
    if (normalized.includes('.') && !normalized.endsWith('.eth')) {
      throw new Error('Invalid ENS name: must end with .eth');
    }
    
    return normalized;
  } catch (error) {
    throw new Error(`Invalid ENS name: ${name}`);
  }
}

/**
 * Resolve ENS name to address
 */
export async function resolveENSName(name: string): Promise<Address | null> {
  try {
    const normalized = normalizeENSName(name);
    const address = await ensClient.getEnsAddress({
      name: normalized,
    });
    return address;
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return null;
  }
}

/**
 * Get reverse resolution (address to ENS name)
 */
export async function reverseResolve(address: Address): Promise<string | null> {
  try {
    const name = await ensClient.getEnsName({
      address,
    });
    return name;
  } catch (error) {
    console.error('Error reverse resolving address:', error);
    return null;
  }
}

/**
 * Validate if a name is a valid subname format (e.g., alice.company.eth)
 */
export function isValidSubname(name: string): boolean {
  const parts = name.split('.');
  return parts.length >= 3 && name.endsWith('.eth');
}

/**
 * Check ENS domain ownership via ENS Registry
 * This checks the actual owner in the registry, not just the resolver
 */
export async function checkENSOwnership(
  domain: string,
  address: Address,
  chainId: number = mainnet.id
): Promise<boolean> {
  try {
    const normalized = normalizeENSName(domain);
    const node = namehash(normalized);
    
    const client = chainId === sepolia.id ? sepoliaClient : ensClient;
    
    const owner = await client.readContract({
      address: ENS_REGISTRY,
      abi: ENS_REGISTRY_ABI,
      functionName: 'owner',
      args: [node],
    });
    
    return owner && owner.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error checking ENS ownership:', error);
    return false;
  }
}

/**
 * Get ENS domain owner from registry
 */
export async function getENSOwner(
  domain: string,
  chainId: number = mainnet.id
): Promise<Address | null> {
  try {
    const normalized = normalizeENSName(domain);
    const node = namehash(normalized);
    
    const client = chainId === sepolia.id ? sepoliaClient : ensClient;
    
    const owner = await client.readContract({
      address: ENS_REGISTRY,
      abi: ENS_REGISTRY_ABI,
      functionName: 'owner',
      args: [node],
    });
    
    return owner || null;
  } catch (error) {
    console.error('Error getting ENS owner:', error);
    return null;
  }
}
