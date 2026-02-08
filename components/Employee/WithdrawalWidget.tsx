'use client'

import { useAccount } from 'wagmi'

export function WithdrawalWidget() {
  const { address, isConnected } = useAccount()

  // TODO: Integrate LI.FI Widget
  // The LI.FI widget has dependency conflicts with Sui SDK
  // For now, this is a placeholder that can be replaced with proper LI.FI integration
  // See: https://docs.li.fi/integrate-li.fi-widget/getting-started

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Please connect your wallet to use the withdrawal widget
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Swap & Bridge
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Bridge your USDC from Arc to Base/Optimism or swap to ETH in a single transaction
        </p>
        
        {/* LI.FI Widget Container */}
        <div className="min-h-[400px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          {/* Placeholder for LI.FI Widget */}
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <svg className="w-16 h-16 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              LI.FI Widget
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Configure your swap and bridge route here
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
              From: USDC (Arc) → To: ETH (Base/Optimism)
            </p>
            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ LI.FI widget integration pending - placeholder UI shown
              </p>
            </div>
          </div>
        </div>

        {/* Alternative: Simple button that would trigger LI.FI flow */}
        <button
          onClick={() => {
            // In production, this would open the LI.FI widget modal or trigger the swap
            alert('LI.FI widget integration: This would open the swap & bridge interface')
          }}
          className="w-full mt-4 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Open Swap & Bridge
        </button>
      </div>
    </div>
  )
}
