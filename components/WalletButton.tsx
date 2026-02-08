'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/Button'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button onClick={() => disconnect()} variant="outline">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect Wallet
    </Button>
  )
}
