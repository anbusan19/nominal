
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight, AlertCircle, Package, Settings, Zap, Copy, Check } from 'lucide-react';

const STEPS = [
  {
    id: 'prerequisites',
    label: 'Prerequisites',
    icon: <AlertCircle size={16} />,
    title: 'System Requirements',
    description: 'Ensure you have Node.js v18+ and access to Arc L1, ENS, and LI.FI.',
    lines: [
      { type: 'comment', text: '# Check Node.js version (v18+ required)' },
      { type: 'cmd', text: 'node --version' },
      { type: 'output', text: 'v20.10.0' },
      { type: 'comment', text: '# Prepare your environment variables' },
      { type: 'cmd', text: 'export ARC_RPC_URL="https://arc-rpc-url"' },
      { type: 'cmd', text: 'export LIFI_API_KEY="your-lifi-api-key"' },
      { type: 'cmd', text: 'export ENS_REGISTRY="0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"' },
      { type: 'success', text: '✔ Environment configured' }
    ]
  },
  {
    id: 'install',
    label: 'Installation',
    icon: <Package size={16} />,
    title: 'Install Dependencies',
    description: 'Add required packages for Nominal integration.',
    lines: [
      { type: 'comment', text: '# Install via NPM' },
      { type: 'cmd', text: 'npm install @ensdomains/ensjs @lifi/sdk ethers' },
      { type: 'output', text: '...' },
      { type: 'output', text: 'added 45 packages in 3s' },
      { type: 'output', text: '45 packages are looking for funding' },
      { type: 'success', text: '✔ Packages installed successfully' }
    ]
  },
  {
    id: 'configure',
    label: 'Configuration',
    icon: <Settings size={16} />,
    title: 'Initialize Nominal',
    description: 'Configure Nominal with Arc, ENS, and LI.FI integrations.',
    lines: [
      { type: 'code', text: "import { ENS } from '@ensdomains/ensjs';" },
      { type: 'code', text: "import { LiFi } from '@lifi/sdk';" },
      { type: 'code', text: "import { ethers } from 'ethers';" },
      { type: 'break' },
      { type: 'code', text: "// Initialize ENS" },
      { type: 'code', text: "const ens = new ENS({ provider, signer });" },
      { type: 'break' },
      { type: 'code', text: "// Initialize LI.FI" },
      { type: 'code', text: "const lifi = new LiFi({" },
      { type: 'code', text: "  integrator: 'nominal-payroll'" },
      { type: 'code', text: "});" },
      { type: 'break' },
      { type: 'code', text: "// Connect to Arc L1" },
      { type: 'code', text: "const provider = new ethers.JsonRpcProvider(" },
      { type: 'code', text: "  process.env.ARC_RPC_URL" },
      { type: 'code', text: ");" }
    ]
  },
  {
    id: 'usage',
    label: 'Usage',
    icon: <Zap size={16} />,
    title: 'Corporate Onboarding',
    description: 'Register ENS domain and distribute payroll.',
    lines: [
      { type: 'comment', text: '// 1. Register corporate ENS domain' },
      { type: 'code', text: "await ens.name('company.eth').setAddress(adminAddress);" },
      { type: 'output', text: "> Domain registered: company.eth" },
      { type: 'break' },
      { type: 'comment', text: '// 2. Create employee subname' },
      { type: 'code', text: "await nameWrapper.setSubnodeRecord(" },
      { type: 'code', text: "  'company.eth', 'alice', employeeAddress" },
      { type: 'code', text: ");" },
      { type: 'output', text: "> Subname created: alice.company.eth" },
      { type: 'break' },
      { type: 'comment', text: '// 3. Distribute payroll' },
      { type: 'code', text: "await payrollVault.batchDistribute(employees, amounts);" },
      { type: 'output', text: "> Payroll distributed to 50 employees" }
    ]
  }
];

// Helper function to highlight keywords in code (like VSCode)
const highlightKeywords = (text: string) => {
  // Escape HTML first
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  let result = escapeHtml(text);
  
  // Keywords to highlight in red (sorted by length, longest first to avoid partial matches)
  const keywords = [
    '@ensdomains/ensjs', '@lifi/sdk', 'process.env', 'console.log', 'ARC_RPC_URL',
    'LIFI_API_KEY', 'ENS_REGISTRY', 'batchDistribute', 'setSubnodeRecord',
    'LiFi', 'ENS', 'parseEther', 'getAddress', 'nameWrapper',
    'ethers', 'lifi', 'ens', 'payrollVault', 'employeeAddress',
    'provider', 'signer', 'integrator', 'setAddress',
    'new', 'const', 'await', 'async', 'import', 'from', 'export',
    'npm', 'install', 'node'
  ];

  // Use a placeholder system to avoid double-highlighting
  const placeholders: string[] = [];
  let placeholderIndex = 0;
  
  // Replace keywords with placeholders first
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
      placeholders.push(`<span class="text-red-500">${match}</span>`);
      return placeholder;
    });
  });

  // Highlight function calls (identifier followed by opening paren) that aren't keywords
  result = result.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, (match, funcName) => {
    // Skip if it's a keyword or already a placeholder
    if (keywords.includes(funcName) || match.includes('__PLACEHOLDER')) {
      return match;
    }
    const placeholder = `__PLACEHOLDER_${placeholderIndex++}__`;
    placeholders.push(`<span class="text-red-500">${funcName}</span>(`);
    return placeholder;
  });

  // Replace placeholders with actual highlighted text
  placeholders.forEach((highlighted, index) => {
    result = result.replace(`__PLACEHOLDER_${index}__`, highlighted);
  });

  return result;
};

const TerminalWindow = ({ title, children, className = "" }) => (
  <div className={`bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10 font-mono text-sm shadow-2xl ${className}`}>
    {/* Title Bar */}
    <div className="bg-[#111] px-4 py-2 flex items-center justify-between border-b border-white/5">
      <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
      </div>
      <div className="text-gray-500 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
        <Terminal size={12} />
        {title}
      </div>
      <div className="w-12" /> {/* Spacer for centering */}
    </div>
    
    {/* Content */}
    <div className="p-6 h-full overflow-y-auto custom-scrollbar relative">
      {children}
    </div>
  </div>
);

const SetupGuide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayedLines([]);
    setIsTyping(true);
    let lineIndex = 0;
    
    const interval = setInterval(() => {
      // Safety check: Ensure activeStep is valid and has lines
      const currentStep = STEPS[activeStep];
      if (!currentStep || !currentStep.lines) return;

      if (lineIndex < currentStep.lines.length) {
        const nextLine = currentStep.lines[lineIndex];
        // Ensure we don't add undefined lines to state
        if (nextLine) {
          setDisplayedLines(prev => [...prev, nextLine]);
        }
        lineIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 200); // Speed of line appearance

    return () => clearInterval(interval);
  }, [activeStep]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen bg-[#080808] py-24 overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">SETUP GUIDE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-manrope leading-tight mb-6 text-white"
          >
            Setting Up <span className="text-brand-orange">Nominal</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed max-w-2xl"
          >
            Follow these simple steps to set up decentralized payroll for your global team.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Navigation */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {STEPS.map((step, idx) => (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`text-left p-5 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                  activeStep === idx 
                    ? 'bg-white/5 border-brand-orange/50' 
                    : 'bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20'
                }`}
              >
                {activeStep === idx && (
                  <motion.div 
                    layoutId="activeStep"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" 
                  />
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded ${
                      activeStep === idx ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' : 'bg-white/10 text-gray-500 border border-white/10'
                    }`}>
                      0{idx + 1}
                    </span>
                    <h3 className={`font-bold font-manrope transition-colors text-base ${activeStep === idx ? 'text-white' : 'text-gray-400'}`}>
                      {step.label}
                    </h3>
                  </div>
                  {activeStep === idx && (
                    <ChevronRight size={18} className="text-brand-orange" />
                  )}
                </div>
                <p className="text-sm text-gray-500 pl-11 line-clamp-1 group-hover:text-gray-400 transition-colors">
                  {step.title}
                </p>
                <p className="text-xs text-gray-600 pl-11 mt-1 line-clamp-2">
                  {step.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Right: Terminal */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative h-[500px]"
            >
              <TerminalWindow 
                title={`bash — ${STEPS[activeStep]?.id || 'terminal'}`} 
                className="h-full"
              >
                <div className="space-y-2">
                  {displayedLines.map((line, i) => (
                    line ? (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="leading-relaxed break-all"
                      >
                        {line.type === 'comment' && (
                          <span className="text-gray-500 italic">{line.text}</span>
                        )}
                        {line.type === 'cmd' && (
                          <div className="flex gap-2 text-white group items-center">
                            <span className="text-red-500 select-none">$</span>
                            <span 
                              className="flex-1" 
                              dangerouslySetInnerHTML={{ __html: highlightKeywords(line.text) }}
                            />
                            <button
                              onClick={() => handleCopy(line.text)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded ml-2"
                            >
                              {copied ? <Check size={14} className="text-red-500" /> : <Copy size={14} className="text-gray-400" />}
                            </button>
                          </div>
                        )}
                        {line.type === 'output' && (
                          <span className="text-gray-400 block pl-4 border-l-2 border-white/10 ml-1">{line.text}</span>
                        )}
                        {line.type === 'success' && (
                          <span className="text-red-500 block font-semibold">{line.text}</span>
                        )}
                        {line.type === 'code' && (
                          <span 
                            className="text-white font-normal block pl-2" 
                            dangerouslySetInnerHTML={{ __html: highlightKeywords(line.text) }}
                          />
                        )}
                        {line.type === 'break' && <br />}
                      </motion.div>
                    ) : null
                  ))}
                  
                  {isTyping && (
                    <div className="inline-block w-2 h-4 bg-red-500 animate-pulse align-middle ml-1" />
                  )}
                  {!isTyping && displayedLines.length > 0 && (
                    <div className="flex gap-2 mt-4 items-center">
                      <span className="text-red-500">$</span>
                      <span className="w-2 h-4 bg-red-500 animate-pulse" />
                    </div>
                  )}
                </div>
              </TerminalWindow>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetupGuide;
