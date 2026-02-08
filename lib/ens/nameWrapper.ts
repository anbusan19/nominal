import { Address, encodeFunctionData, parseAbi } from 'viem';
import { ENS_NAME_WRAPPER } from './utils';
import { normalizeENSName } from './utils';

// NameWrapper ABI (simplified - add full ABI as needed)
const NAME_WRAPPER_ABI = parseAbi([
  'function setSubnodeRecord(bytes32 parentNode, string label, address owner, address resolver, uint64 ttl, uint32 fuses, uint64 expiry)',
  'function setSubnodeOwner(bytes32 parentNode, string label, address owner) returns (bytes32)',
  'function ownerOf(uint256 id) view returns (address)',
  'function getData(uint256 id) view returns (address owner, address resolver, uint64 ttl, uint64 expiry, uint32 fuses)',
]);

/**
 * Create a subname under a parent ENS domain
 * @param parentDomain The parent domain (e.g., "company.eth")
 * @param label The subname label (e.g., "alice")
 * @param ownerAddress The address that will own the subname
 */
export function createSubnameData(
  parentDomain: string,
  label: string,
  ownerAddress: Address
) {
  const normalizedParent = normalizeENSName(parentDomain);
  // In production, you'd need to compute the namehash properly
  // This is a simplified version
  
  return {
    to: ENS_NAME_WRAPPER,
    functionName: 'setSubnodeOwner' as const,
    args: [
      normalizedParent, // parentNode (namehash)
      label,
      ownerAddress,
    ],
  };
}

/**
 * Check if a subname exists and get its owner
 */
export async function getSubnameOwner(
  subname: string
): Promise<Address | null> {
  try {
    // Implementation would use namehash to get token ID
    // and then call ownerOf(tokenId)
    // This is a placeholder
    return null;
  } catch (error) {
    console.error('Error getting subname owner:', error);
    return null;
  }
}
