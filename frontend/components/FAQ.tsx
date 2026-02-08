import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { question: "What is Nominal?", answer: "Nominal is a decentralized payroll management system that combines ENS identity with automated stablecoin distribution. It allows companies to manage global teams through ENS subnames and enables employees to receive and bridge salaries to any EVM chain." },
  { question: "How does ENS integration work?", answer: "Companies register their primary ENS domain (e.g., google.eth) and issue employee subnames (e.g., alice.google.eth) using ENS NameWrapper. This creates human-readable identity mappings that replace the need to store raw hex addresses manually." },
  { question: "What is Arc and why is it used?", answer: "Arc (Circle) serves as the primary Economic OS for Nominal. Corporate treasuries are held as USDC on Arc L1 to ensure high-fidelity settlement and regulatory-ready stablecoin infrastructure. This provides reliable, fast payroll distribution." },
  { question: "How do employees bridge their salaries?", answer: "Upon receiving USDC on Arc L1, employees use the integrated LI.FI protocol to 'Claim & Bridge.' This allows them to move USDC to any supported EVM chain (Base, Arbitrum, Polygon, etc.) or swap it into other assets in a single transaction." },
  { question: "Can employees change their wallet addresses?", answer: "Yes! The system resolves payroll addresses from ENS subnames at distribution time. Employees can update their subname's resolved address at any time without interrupting the payroll cycle, allowing for key rotation and wallet management." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-black border-t border-white/10">
      <div className="w-full px-6 md:px-12 lg:px-24 grid md:grid-cols-3 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold font-manrope mb-6"
          >
            Frequently <br/> asked <br/> questions
          </motion.h2>
          <motion.a 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            href="https://github.com/your-username/nominal" 
            target="_blank" 
            className="inline-block bg-brand-orange text-white px-6 py-3 rounded font-bold hover:bg-red-600 transition-colors"
          >
             VIEW ON GITHUB
          </motion.a>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 space-y-4"
        >
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="border-b border-white/10 pb-4"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left py-4 hover:text-brand-orange transition-colors group"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <span className="text-gray-500 group-hover:text-brand-orange">
                  {openIndex === idx ? <Minus size={20}/> : <Plus size={20}/>}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="font-mono text-gray-400 pb-4 pr-12">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;