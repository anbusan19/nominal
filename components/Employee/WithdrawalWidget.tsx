'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { ARC_USDC_ADDRESS } from '@/lib/config/chains'

// Arc Testnet Chain ID
const ARC_CHAIN_ID = 5042002

// Dynamic import for LI.FI Widget
let LiFiWidgetComponent: any = null

export function WithdrawalWidget() {
  const { address, isConnected } = useAccount()
  const [Widget, setWidget] = useState<any>(null)

  useEffect(() => {
    // Dynamically import LI.FI widget to avoid SSR issues
    if (typeof window !== 'undefined') {
      import('@lifi/widget').then((module) => {
        LiFiWidgetComponent = module.LiFiWidget
        setWidget(() => LiFiWidgetComponent)
      }).catch((error) => {
        console.error('Error loading LI.FI widget:', error)
      })
    }
  }, [])

  // LI.FI Widget Configuration
  const widgetConfig = {
    fromChain: ARC_CHAIN_ID,
    fromToken: ARC_USDC_ADDRESS,
    toChain: undefined, // Allow user to select destination
    toToken: undefined, // Allow user to select token
    // Restrict from chain to only Arc Testnet
    chains: {
      allow: {
        from: [ARC_CHAIN_ID], // Only allow bridging FROM Arc
        to: undefined, // Allow any destination chain
      },
    },
    // Theme configuration
    appearance: 'auto' as const,
    theme: {
      container: {
        borderRadius: '12px',
      },
    },
    // API key (optional but recommended)
    apiKey: process.env.NEXT_PUBLIC_LI_FI_API_KEY,
  }

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
          Bridge your USDC from Arc Testnet (Chain {ARC_CHAIN_ID}) to any other chain or swap to other assets in a single transaction
        </p>
        
        {/* LI.FI Widget Container */}
        <div className="min-h-[500px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {Widget ? (
            <Widget
              config={widgetConfig}
              integrator="nominal-payroll"
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[500px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading LI.FI Widget...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
