import { createPublicClient, http, Address } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from '@ensdomains/ensjs/utils';

export const ENS_REGISTRY = (process.env.NEXT_PUBLIC_ENS_REGISTRY ||
  '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e') as Address;

export const ENS_NAME_WRAPPER = (process.env.NEXT_PUBLIC_ENS_NAME_WRAPPER ||
  '0x0635513f179D50A207757E05759CbD106d7dFcE8') as Address;

// Public client for ENS resolution (mainnet)
export const ensClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Normalize an ENS name
 */
export function normalizeENSName(name: string): string {
  try {
    return normalize(name);
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
