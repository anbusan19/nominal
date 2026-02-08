'use client'

import Link from 'next/link'
import { WalletButton } from './WalletButton'

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Nominal
            </span>
          </Link>
          <WalletButton />
        </div>
      </div>
    </nav>
  )
}
