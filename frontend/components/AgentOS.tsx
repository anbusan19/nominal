import React from 'react';
import { motion } from 'framer-motion';

const AgentOS = () => {
  return (
    <section className="py-32 flex flex-col items-center justify-center text-center bg-black relative">
      <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         whileInView={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.8 }}
         viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-8xl font-bold font-manrope mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
          Payroll Anywhere <br />
          <span className="text-brand-orange">Zero Friction</span>
        </h2>
        <p className="text-gray-400 text-xl font-mono mt-4">Global teams. ENS identity. Cross-chain salaries.</p>
      </motion.div>
    </section>
  );
};

export default AgentOS;