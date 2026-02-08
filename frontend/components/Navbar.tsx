import React from 'react';
import { Menu, Github, Package } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] border border-white/20 bg-white/10 dark:bg-black/30 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/20">
      <div className="px-6 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <img src="/nominal-full.svg" alt="Nominal" className="h-6 w-auto object-contain" />

        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300 absolute left-1/2 transform -translate-x-1/2">
          <a href="#how-it-works" className="hover:text-white transition-colors scroll-smooth">How It Works</a>
          <a href="#architecture" className="hover:text-white transition-colors scroll-smooth">Architecture</a>
          <a href="#setup-guide" className="hover:text-white transition-colors scroll-smooth">Setup Guide</a>
          <a href="#footer" className="hover:text-white transition-colors scroll-smooth">Quick Links</a>
          <a href="#faq" className="hover:text-white transition-colors scroll-smooth">FAQ</a>
        </div>

        <div className="hidden md:flex items-right justify-end gap-3">
          <a 
            href="https://github.com/anbusan19/nominal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-semibold text-sm transition-all border border-white/20 hover:border-white/30"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <a 
            href="https://docs.ens.domains" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-orange hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm transition-all shadow-[0_0_20px_rgba(232,65,66,0.3)] hover:shadow-[0_0_30px_rgba(232,65,66,0.5)]"
          >
            <Package size={16} />
            <span>Docs</span>
          </a>
          <a 
            href="https://nominal-core.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-semibold text-sm transition-all border border-white/20 hover:border-white/30"
          >
            <span>Demo</span>
          </a>
        </div>

        <div className="md:hidden text-white">
          <Menu className="w-6 h-6" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;