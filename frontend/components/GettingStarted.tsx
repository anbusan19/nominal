import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Download, ArrowRight, Code } from 'lucide-react';

const GettingStarted = () => {
  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="w-full px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-bold font-manrope mb-8">
            Integrate in <br/> minutes
          </h2>
          <div className="flex gap-12 text-sm font-mono text-gray-500 border-b border-white/10 pb-4">
             <div className="text-white flex items-center gap-2">
                <span className="bg-brand-orange text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                INSTALL SDK
             </div>
             <div className="flex items-center gap-2">
                <span className="border border-gray-600 w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                CONFIGURE
             </div>
             <div className="flex items-center gap-2">
                <span className="border border-gray-600 w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
                PAY & VERIFY
             </div>
          </div>
        </div>

        {/* UI Container */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Main Interface: Code Editor */}
          <motion.div 
             className="md:col-span-2 glass-card rounded-xl overflow-hidden min-h-[400px] border border-white/10"
             initial={{ y: 50, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             viewport={{ once: true }}
          >
             <div className="bg-[#1a1a1a] p-3 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="mx-auto text-xs text-gray-500 font-mono">warp-sdk-example.ts</div>
             </div>
             <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                <div className="text-purple-400">import</div> <span className="text-white">{'{ Warp402 }'}</span> <div className="text-purple-400 inline">from</div> <span className="text-green-400">'avax-warp-pay'</span>;
                <br/><br/>
                <span className="text-gray-500">// Initialize SDK</span>
                <br/>
                <span className="text-purple-400">const</span> warp = <span className="text-purple-400">new</span> <span className="text-yellow-400">Warp402</span>({'{'}
                <br/>&nbsp;&nbsp;privateKey: <span className="text-green-400">"YOUR_KEY"</span>,
                <br/>&nbsp;&nbsp;senderChain: {'{'} ... {'}'},
                <br/>&nbsp;&nbsp;receiverChain: {'{'} ... {'}'}
                <br/>{'}'});
                <br/><br/>
                <span className="text-gray-500">// Send payment on Chain A</span>
                <br/>
                <span className="text-purple-400">const</span> paymentId = <span className="text-purple-400">await</span> warp.<span className="text-blue-400">pay</span>(
                <br/>&nbsp;&nbsp;ethers.<span className="text-blue-400">parseEther</span>(<span className="text-green-400">"1.0"</span>)
                <br/>);
                <br/><br/>
                <span className="text-gray-500">// Verify on Chain B</span>
                <br/>
                <span className="text-purple-400">const</span> isPaid = <span className="text-purple-400">await</span> warp.<span className="text-blue-400">verify</span>(paymentId);
             </div>
          </motion.div>

          {/* Side Panel: CLI */}
          <motion.div 
            className="glass-card rounded-xl p-6 border border-white/10 flex flex-col justify-between"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
             <div>
                <h3 className="text-lg font-bold font-manrope mb-4">Installation</h3>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-white/5 mb-6">
                   <div className="text-gray-500 select-none">$</div> npm install avax-warp-pay
                </div>
                
                <h3 className="text-lg font-bold font-manrope mb-4">Supported Networks</h3>
                <div className="space-y-3">
                   <div className="bg-white/5 p-3 rounded text-sm flex justify-between items-center">
                      <span>Fuji C-Chain</span>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   </div>
                   <div className="bg-white/5 p-3 rounded text-sm flex justify-between items-center">
                      <span>Local Subnets</span>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   </div>
                   <div className="bg-white/5 p-3 rounded text-sm flex justify-between items-center">
                      <span>Mainnet (Beta)</span>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                   </div>
                </div>
             </div>
             
             <a href="https://github.com/jayasurya0007/wrap-x402" target="_blank" className="w-full bg-white text-black font-bold py-3 rounded mt-6 text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                READ DOCS <ArrowRight size={14} />
             </a>
          </motion.div>
        </div>

        {/* Feature Grid Below */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
           <div className="glass-card p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold font-manrope mb-2">SDK-Powered Server</h3>
              <p className="text-gray-400 text-sm mb-6">Production HTTP 402 server powered by the SDK. Includes health monitoring and automatic CORS support.</p>
              <div className="flex gap-2">
                 <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-1 rounded">Node.js</span>
                 <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-1 rounded">TypeScript</span>
              </div>
           </div>

           <div className="glass-card p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold font-manrope mb-2">Battle-Tested Contracts</h3>
              <p className="text-gray-400 text-sm mb-6">Includes ReentrancyGuard, Ownable, and Pausable protections. 60+ comprehensive Foundry tests.</p>
              <div className="font-mono text-xs bg-black/50 p-4 rounded border-l-2 border-green-500">
                 <div className="text-green-500 mb-1">✓ Access Control Verified</div>
                 <div className="text-green-500 mb-1">✓ Reentrancy Guarded</div>
                 <div className="text-gray-500">100% Test Coverage</div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default GettingStarted;