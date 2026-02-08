import React from 'react';
import { motion } from 'framer-motion';
import { Github, Package } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="footer" className="relative bg-brand-orange text-white py-20 overflow-hidden">
      {/* Footer Content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16"
        >
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="font-mono uppercase text-sm font-bold tracking-widest mb-6 border-b border-white/20 pb-2">
              <div className="flex items-center mb-4 gap-2">
                <img src="/nominal.svg" alt="Nominal" className="h-8 w-auto object-contain" />
                <span className="text-2xl font-bold">Nominal</span>
              </div>
              Nominal: Sovereign Payroll Infrastructure
            </h3>
            <p className="max-w-md text-sm leading-relaxed mb-6">
              Decentralized payroll management for global teams. Combining ENS identity with automated stablecoin distribution on Arc L1.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/your-username/nominal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-brand-orange p-3 font-bold hover:bg-gray-100 transition-colors rounded flex items-center justify-center"
                aria-label="Star on GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://docs.ens.domains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 border border-white/30 text-white p-3 font-bold hover:bg-white/20 transition-colors rounded flex items-center justify-center"
                aria-label="ENS Documentation"
              >
                <Package size={20} />
              </a>
            </div>
          </motion.div>

          {/* Navigation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4 className="font-bold font-mono mb-4 text-white/90 uppercase text-xs tracking-wider">NAVIGATION</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li><a href="#" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">HOME</a></li>
              <li><a href="#how-it-works" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">HOW IT WORKS</a></li>
              <li><a href="#architecture" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">ARCHITECTURE</a></li>
              <li><a href="#setup-guide" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">SETUP GUIDE</a></li>
              <li><a href="#faq" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">FAQ</a></li>
            </ul>
          </motion.div>

          {/* Developer Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className="font-bold font-mono mb-4 text-white/90 uppercase text-xs tracking-wider">DEVELOPER</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a 
                  href="https://docs.ens.domains" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  ENS DOCS
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.circle.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  ARC DOCS
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.li.fi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  LI.FI SDK
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/your-username/nominal/tree/main/contracts" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  CONTRACTS
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/your-username/nominal/tree/main/frontend" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  FRONTEND
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Resources & Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h4 className="font-bold font-mono mb-4 text-white/90 uppercase text-xs tracking-wider">RESOURCES</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a 
                  href="https://github.com/your-username/nominal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  GITHUB REPO
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/your-username/nominal/blob/main/README.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  DOCUMENTATION
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.ens.domains" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  ENS DOCS
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.circle.com/arc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  ARC DOCS
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.li.fi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  LI.FI DOCS
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10 w-full px-6 md:px-12 lg:px-24 mt-12 flex flex-col md:flex-row justify-between items-center border-t border-white/20 pt-8 font-mono text-xs"
      >
        <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
          <span className="opacity-80">MIT LICENSE</span>
          <a 
            href="https://github.com/jayasurya0007/wrap-x402/blob/main/LICENSE" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-opacity hover:underline"
          >
            VIEW LICENSE
          </a>
        </div>
        <div className="text-center md:text-right">
          © 2025 NOMINAL. SOVEREIGN PAYROLL INFRASTRUCTURE.
        </div>
      </motion.div>
      
    </footer>
    
  );
};

export default Footer;