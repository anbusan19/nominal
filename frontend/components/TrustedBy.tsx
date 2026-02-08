import React from 'react';
import { motion } from 'framer-motion';

const TrustedBy = () => {
  return (
    <section className="py-20 border-b border-white/5 bg-brand-dark relative z-20">
      <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">ABOUT</span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-manrope leading-tight mb-8 text-white"
          >
            Decentralized Payroll <span className="text-brand-orange">for Global Teams</span>
          </motion.h2>

          {/* Summary Text */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 leading-relaxed mb-12 max-w-3xl"
          >
            Nominal is a decentralized payroll management system designed for the global, remote-first workforce. 
            It eliminates the friction of traditional cross-border payments by combining ENS identity with automated 
            stablecoin distribution on Arc L1, enabling employees to bridge salaries to any chain in a single transaction.
          </motion.p>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 text-left justify-items-start"
          >
            <div className="flex flex-col items-start">
              <img src="/ens-logo-Blue.svg" alt="ENS" className="h-12 md:h-16 w-auto object-contain mb-3 opacity-90 hover:opacity-100 transition-opacity" />
              <div className="text-sm md:text-base text-gray-400">
                Identity Layer
              </div>
            </div>

            <div className="flex flex-col items-start">
              <img src="/arc.svg" alt="Arc" className="h-12 md:h-16 w-auto object-contain mb-3 opacity-90 hover:opacity-100 transition-opacity" />
              <div className="text-sm md:text-base text-gray-400">
                Treasury OS
              </div>
            </div>

            <div className="flex flex-col items-start">
              <img src="/logo_lifi_dark_horizontal.svg" alt="LI.FI" className="h-10 md:h-14 w-auto object-contain mb-3 opacity-90 hover:opacity-100 transition-opacity" />
              <div className="text-sm md:text-base text-gray-400">
                Cross-Chain Bridge
              </div>
            </div>
          </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
