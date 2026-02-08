import { LiFi } from '@lifi/sdk';

// Initialize LI.FI SDK
export const lifi = new LiFi({
  integrator: 'nominal-payroll',
  apiKey: process.env.LI_FI_API_KEY,
});

/**
 * Get available routes for bridging/swapping
 */
export async function getRoutes(params: {
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAddress: string;
}) {
  try {
    const routes = await lifi.getRoutes(params);
    return routes;
  } catch (error) {
    console.error('Error getting LI.FI routes:', error);
    throw error;
  }
}

/**
 * Execute a bridge/swap transaction
 */
export async function executeRoute(route: any, signer: any) {
  try {
    const result = await lifi.executeRoute(route, signer);
    return result;
  } catch (error) {
    console.error('Error executing LI.FI route:', error);
    throw error;
  }
}
