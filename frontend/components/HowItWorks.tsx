import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Copy, Check, FileCode, Folder, Zap, ChevronRight, Lock, Unlock } from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs to track state inside the event listener without re-binding
  const stepRef = useRef(1);
  const isScrollingRef = useRef(false);
  const totalSteps = 4;

  // Keep stepRef in sync with activeStep
  useEffect(() => {
    stepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // 1. Check Boundary: Only engage if the section is roughly at the top of the viewport
      const rect = container.getBoundingClientRect();
      const isAtTop = Math.abs(rect.top) < 50; // 50px tolerance

      // If we aren't centered at the top, let the user scroll naturally to get there (or away)
      if (!isAtTop) return;

      // 2. Check Animation Cooldown
      if (isScrollingRef.current) {
        e.preventDefault(); 
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const currentStep = stepRef.current;

      // SCROLL DOWN LOGIC
      if (direction === 1) {
        if (currentStep < totalSteps) {
          // If NOT at the last step, LOCK scroll and advance
          e.preventDefault();
          isScrollingRef.current = true;
          stepRef.current = currentStep + 1;
          setActiveStep(stepRef.current);
          
          setTimeout(() => { isScrollingRef.current = false; }, 800);
        } 
        // If at last step, allow default (scrolls page down to next section)
      } 
      
      // SCROLL UP LOGIC
      else if (direction === -1) {
        if (currentStep > 1) {
          // If NOT at the first step, LOCK scroll and go back
          e.preventDefault();
          isScrollingRef.current = true;
          stepRef.current = currentStep - 1;
          setActiveStep(stepRef.current);
          
          setTimeout(() => { isScrollingRef.current = false; }, 800);
        }
        // If at first step, allow default (scrolls page up to previous section)
      }
    };

    // Add native event listener with { passive: false } to allow preventing default
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [totalSteps]);

  const steps = [
    {
      id: 1,
      title: "Corporate Identity Onboarding",
      description: "Companies connect their administrative wallet and register their primary ENS domain (e.g., google.eth). This domain acts as the root of the corporate identity tree.",
      icon: <Lock size={20} className="text-brand-orange" />,
      terminal: "Connect wallet and register ENS domain",
      code: `// Corporate Identity Onboarding
import { ethers } from 'ethers';
import { ENS } from '@ensdomains/ensjs';

// Connect company admin wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const ens = new ENS({ provider, signer });

// Register primary ENS domain
async function registerCorporateDomain() {
  const domain = 'google.eth';
  
  // Check if domain is available
  const available = await ens.name(domain).getAvailable();
  
  if (available) {
    // Register domain as company root
    const tx = await ens.name(domain).setAddress(signer.address);
    await tx.wait();
    
    console.log('Corporate domain registered:', domain);
    // This becomes the root for employee subnames
  }
}

registerCorporateDomain();`,
      fileName: "onboarding.js",
    },
    {
      id: 2,
      title: "Employee Provisioning",
      description: "Employees connect their wallets and request a subname linked to the corporate domain (e.g., alice.google.eth). The system utilizes ENS NameWrapper to issue these subnames.",
      icon: <Zap size={20} className="text-yellow-400" />,
      terminal: "Request employee subname via ENS NameWrapper",
      code: `// Employee Provisioning with ENS NameWrapper
import { ethers } from 'ethers';
import { NameWrapper } from '@ensdomains/ensjs';

const nameWrapper = new NameWrapper({ provider, signer });

async function requestEmployeeSubname() {
  const corporateDomain = 'google.eth';
  const employeeName = 'alice';
  const employeeSubname = \`\${employeeName}.\${corporateDomain}\`;
  
  // Request subname creation
  // NameWrapper allows the company to issue subnames
  const tx = await nameWrapper.setSubnodeRecord(
    corporateDomain,
    employeeName,
    {
      owner: employeeAddress,
      resolver: resolverAddress,
      ttl: 0
    }
  );
  
  await tx.wait();
  console.log('Employee subname created:', employeeSubname);
  // alice.google.eth now resolves to employee's wallet
}

requestEmployeeSubname();`,
      fileName: "provisioning.js",
    },
    {
      id: 3,
      title: "Automated Payroll Distribution",
      description: "The company funds a treasury vault on Arc L1. At the end of the pay period, a batch transaction distributes USDC to the resolved addresses of all registered subnames.",
      icon: <ArrowRight size={20} className="text-blue-400" />,
      terminal: "Execute batch payroll distribution on Arc",
      code: `// Automated Payroll Distribution
import { ethers } from 'ethers';
import { ENS } from '@ensdomains/ensjs';

const payrollVault = new ethers.Contract(
  vaultAddress,
  vaultABI,
  signer
);

async function distributePayroll() {
  const corporateDomain = 'google.eth';
  const employees = ['alice', 'bob', 'charlie'];
  const usdcAmount = ethers.parseUnits('5000', 6); // $5000 USDC
  
  // Resolve employee addresses from ENS subnames
  const addresses = await Promise.all(
    employees.map(async (name) => {
      const subname = \`\${name}.\${corporateDomain}\`;
      const resolver = await ens.name(subname).getResolver();
      const address = await resolver.getAddress();
      return { subname, address };
    })
  );
  
  // Batch transfer USDC from Arc vault
  const tx = await payrollVault.batchDistribute(
    addresses.map(a => a.address),
    addresses.map(() => usdcAmount)
  );
  
  await tx.wait();
  console.log('Payroll distributed to', addresses.length, 'employees');
}

distributePayroll();`,
      fileName: "payroll.js",
    },
    {
      id: 4,
      title: "Sovereign Withdrawal & Bridge",
      description: "Upon receiving funds, employees use the integrated LI.FI protocol to 'Claim & Bridge.' This allows them to move USDC from Arc to any supported EVM chain or swap it into other assets in a single flow.",
      icon: <Unlock size={20} className="text-green-400" />,
      terminal: "Bridge USDC to destination chain via LI.FI",
      code: `// Sovereign Withdrawal with LI.FI
import { LiFi } from '@lifi/sdk';

const lifi = new LiFi({
  integrator: 'nominal-payroll'
});

async function claimAndBridge() {
  const fromChain = 43114; // Arc L1
  const toChain = 8453; // Base
  const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
  
  // Get quote for bridging USDC from Arc to Base
  const quote = await lifi.getQuote({
    fromChain,
    toChain,
    fromToken: tokenAddress,
    toToken: tokenAddress,
    fromAmount: '5000000000', // 5000 USDC (6 decimals)
    fromAddress: employeeAddress,
    toAddress: employeeAddress
  });
  
  // Execute the bridge transaction
  const tx = await lifi.executeRoute({
    route: quote,
    signer: employeeSigner
  });
  
  await tx.wait();
  console.log('USDC bridged from Arc to Base');
  // Employee can now use funds on their preferred chain
}

claimAndBridge();`,
      fileName: "withdrawal.js",
    },
  ];

  const activeStepData = steps.find(s => s.id === activeStep) || steps[0];
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'macos' | 'windows'>('macos');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
        ref={containerRef}
        className="relative min-h-screen bg-[#080808] py-20"
    >
      
      {/* Main container */}
      <div className="h-full overflow-hidden flex items-center">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
          {/* CHANGED: Removed 'items-start' to allow columns to stretch to equal height */}
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left Panel: Text Content */}
            {/* CHANGED: Added 'flex flex-col h-full justify-between' to force content to spread and align bottoms */}
            <div className="flex flex-col h-full justify-between py-2">
              
              {/* Top Section Wrapper */}
              <div>
                {/* Category Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">PRODUCT</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="text-4xl md:text-6xl font-bold font-manrope leading-tight mb-6 text-white"
                >
                  Decentralized payroll <span className="text-brand-orange">for global teams</span>
                </motion.h2>

                {/* Subtitle - Animated */}
                <div className="min-h-[80px]">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-gray-400 text-lg leading-relaxed mb-8"
                    >
                      {activeStepData.description}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Terminal/Command Block - Animated */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-lg mb-8">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-gray-500">01 - TERMINAL / IDE</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedTab('macos')}
                        className={`px-3 py-1 text-xs font-mono transition-colors rounded ${
                          selectedTab === 'macos' 
                            ? 'bg-white/10 text-white' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        MACOS
                      </button>
                      <button
                        onClick={() => setSelectedTab('windows')}
                        className={`px-3 py-1 text-xs font-mono transition-colors rounded ${
                          selectedTab === 'windows' 
                            ? 'bg-white/10 text-white' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        WIN
                      </button>
                    </div>
                  </div>
                  <div className="p-4 min-h-[60px] flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between w-full group"
                      >
                        <div className="flex items-center gap-2 font-mono text-sm overflow-hidden">
                          <span className="text-gray-500 select-none">$</span>
                          <span className="text-gray-100 truncate">{activeStepData.terminal}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(activeStepData.terminal)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded ml-2"
                        >
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Step Navigation - Pushed to Bottom */}
              <div className="mt-auto">
                {/* Progress Circles */}
                <div className="flex gap-2 mb-4">
                  {steps.map((step) => (
                    <motion.div
                      key={step.id}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        activeStep === step.id ? 'bg-brand-orange' : 'bg-gray-600'
                      }`}
                      animate={{
                        backgroundColor: activeStep === step.id ? '#FF6B35' : '#4B5563',
                        scale: activeStep === step.id ? 1.2 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>

                {/* Step List */}
                <div className="space-y-1">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 transition-colors cursor-pointer ${
                        activeStep === step.id
                          ? 'text-brand-orange'
                          : 'text-gray-500'
                      }`}
                      onClick={() => {
                        stepRef.current = step.id;
                        setActiveStep(step.id);
                      }}
                    >
                      <span className={`font-mono text-xs font-medium w-5 ${activeStep === step.id ? 'text-brand-orange' : 'text-gray-500'}`}>
                        {String(step.id).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider">
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Panel: Code Editor */}
            {/* Height is determined by the CodeEditor component, left panel will stretch to match */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative h-full flex items-center"
            >
              <CodeEditor 
                code={activeStepData.code}
                fileName={activeStepData.fileName}
                stepTitle={activeStepData.title}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Code Editor Component
interface CodeEditorProps {
  code: string;
  fileName: string;
  stepTitle: string;
}

const CodeEditor = ({ code, fileName, stepTitle }: CodeEditorProps) => {
  type FileTreeItem = 
    | { name: string; type: 'folder'; expanded: boolean; children?: FileTreeItem[] }
    | { name: string; type: 'file'; active?: boolean };

  const fileTree: FileTreeItem[] = [
    { name: '.github', type: 'folder', expanded: false },
    { name: 'src', type: 'folder', expanded: true, children: [
      { name: fileName, type: 'file', active: true }
    ]},
    { name: 'package.json', type: 'file' },
  ];

  const syntaxHighlight = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      return (
        <div key={idx} className="flex hover:bg-white/5 transition-colors">
          <span className="text-gray-700 select-none mr-4 w-8 text-right text-xs pt-0.5">{idx + 1}</span>
          <span className="flex-1 font-mono text-[13px] text-gray-300 whitespace-pre">{line || ' '}</span>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl mx-auto"
    >
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={stepTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-mono text-gray-500 uppercase tracking-wider"
          >
            {stepTitle}
          </motion.div>
        </AnimatePresence>
        <div className="w-16"></div>
      </div>

      <div className="flex h-[700px]">
        {/* Sidebar */}
        <div className="w-48 bg-[#0D0D0D] border-r border-white/5 p-3 hidden sm:block">
          <div className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-3 px-2">EXPLORER</div>
          <div className="space-y-1">
            {fileTree.map((item, idx) => (
              <div key={idx} className="text-xs">
                {item.type === 'folder' ? (
                  <>
                    <div className="flex items-center gap-1 px-2 py-1 text-gray-400">
                      <ChevronRight size={12} className={item.expanded ? 'rotate-90' : ''} />
                      <Folder size={12} />
                      <span>{item.name}</span>
                    </div>
                    {item.children && item.expanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child, cIdx) => (
                           <motion.div key={cIdx} 
                            layoutId={child.type === 'file' && child.active ? "active-file" : undefined}
                            className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${child.type === 'file' && child.active ? 'bg-brand-orange/10 text-brand-orange' : 'text-gray-500'}`}
                           >
                              <FileCode size={12} />
                              <span>{child.name}</span>
                           </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 text-gray-500">
                      <FileCode size={12} />
                      <span>{item.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-1 bg-[#111] border-b border-white/5 px-2 overflow-x-auto no-scrollbar">
             <div className="px-3 py-2 bg-[#0A0A0A] border-t-2 border-brand-orange text-sm font-mono text-white flex items-center gap-2 whitespace-nowrap">
                <FileCode size={12} className="text-brand-orange"/>
                {fileName}
             </div>
          </div>
          <div className="flex-1 overflow-auto bg-[#0A0A0A] p-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={fileName}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {syntaxHighlight(code)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;