'use client'

import Link from 'next/link'
import { WalletButton } from './WalletButton'

export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] border border-white/20 bg-white/10 dark:bg-black/30 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/20">
      <div className="px-6 h-16 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2">
          <img src="/nominal-full.svg" alt="Nominal" className="h-6 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/employer/register" className="hover:text-white transition-colors scroll-smooth">Register</Link>
          <Link href="/admin" className="hover:text-white transition-colors scroll-smooth">Admin</Link>
          <Link href="/employee" className="hover:text-white transition-colors scroll-smooth">Employee</Link>
        </div>

        <div className="flex items-center justify-end">
          <WalletButton />
        </div>
      </div>
    </nav>
  )
}
