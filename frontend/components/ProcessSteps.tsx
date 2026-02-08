import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Check, Globe, Send, Server, CreditCard, Lock } from 'lucide-react';

const ProcessSteps = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-24 flex flex-col gap-32">
        
        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-orange font-mono text-lg font-bold mb-4 block">01.</span>
            <h2 className="text-4xl md:text-6xl font-bold font-manrope mb-6">
              Client requests <br/> resource
            </h2>
            <p className="text-gray-400 text-lg">
              The user attempts to access a protected resource. The server responds with a 402 Payment Required status and a unique payment ID.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 rounded-xl relative"
          >
            {/* UI Mockup: HTTP Request */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-gray-500 font-mono mb-1">GET /resource</div>
                <div className="text-xl font-bold flex items-center gap-2">
                   <Lock size={18} className="text-brand-orange"/>
                   402 Payment Required
                </div>
              </div>
              <div className="text-brand-orange">
                <Globe size={24} />
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded text-sm text-gray-300 font-mono leading-relaxed mb-4">
              <span className="text-purple-400">{"{"}</span>
              <br/>
              &nbsp;&nbsp;<span className="text-blue-400">"error"</span>: <span className="text-green-400">"Payment Required"</span>,
              <br/>
              &nbsp;&nbsp;<span className="text-blue-400">"paymentId"</span>: <span className="text-green-400">"0x7f...a1b2"</span>,
              <br/>
              &nbsp;&nbsp;<span className="text-blue-400">"amount"</span>: <span className="text-yellow-400">"1000000000000000000"</span>
              <br/>
              <span className="text-purple-400">{"}"}</span>
            </div>
            <div className="flex gap-2 text-xs font-mono">
              <span className="bg-brand-orange/20 text-brand-orange px-2 py-1 rounded flex items-center gap-1">
                Awaiting Payment
              </span>
              <span className="bg-white/10 px-2 py-1 rounded text-white flex items-center gap-1">
                TTL: 7 Days
              </span>
            </div>
          </motion.div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
           {/* Order 2 on mobile to keep text first */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 md:order-1 glass-card p-6 rounded-xl"
          >
             {/* UI Mockup: Sender Chain */}
             <div className="grid gap-3">
                <div className="bg-brand-card border-l-2 border-brand-orange p-3 rounded bg-white/5">
                   <div className="text-xs text-brand-orange mb-1 font-bold">Sender Chain (Fuji)</div>
                   <div className="font-bold mb-1">WarpSender.sol</div>
                   <div className="text-xs text-gray-500 font-mono">sendPayment(paymentId)</div>
                </div>
                <div className="flex justify-center -my-2 z-10 relative">
                   <div className="bg-white/10 p-1 rounded-full text-gray-400">
                      <div className="h-4 w-0.5 bg-white/20 mx-auto"></div>
                   </div>
                </div>
                <div className="bg-brand-card border-l-2 border-blue-500 p-3 rounded bg-white/5">
                   <div className="text-xs text-blue-500 mb-1 font-bold">Teleporter Protocol</div>
                   <div className="font-bold mb-1">Cross-Chain Message</div>
                   <div className="mt-2 flex gap-2">
                      <div className="bg-black p-1 rounded border border-white/10">
                        <Send size={12} className="text-blue-500" />
                      </div>
                      <div className="text-xs font-mono text-gray-400">Relaying to Subnet...</div>
                   </div>
                </div>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <span className="text-brand-orange font-mono text-lg font-bold mb-4 block">02.</span>
            <h2 className="text-4xl md:text-6xl font-bold font-manrope mb-6">
              Pay on <br/> Source Chain
            </h2>
            <p className="text-gray-400 text-lg">
              The user sends funds to the `WarpSender` contract on Chain A. The contract instantly dispatches a cross-chain message via Avalanche Teleporter.
            </p>
          </motion.div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-orange font-mono text-lg font-bold mb-4 block">03.</span>
            <h2 className="text-4xl md:text-6xl font-bold font-manrope mb-6">
              Verify on <br/> Destination
            </h2>
            <p className="text-gray-400 text-lg">
              `WarpReceiver` on Chain B validates the Teleporter message. The client verifies the payment and the server unlocks the resource.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-xl overflow-hidden"
          >
             {/* UI Mockup: Verification */}
             <div className="bg-black/80 p-2 flex items-center justify-between border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono">Server Verification</div>
             </div>
             <div className="p-4 bg-[#0d0d0d] font-mono text-xs md:text-sm overflow-x-auto">
                <div className="text-gray-500 mb-2"># Check payment status</div>
                <div className="text-purple-400">const</div>
                <div className="pl-4">
                  <span className="text-blue-400">isPaid</span> = <span className="text-purple-400">await</span> warp.verify(
                </div>
                <div className="pl-8 text-gray-300">
                  <span className="text-green-400">"0x7f...a1b2"</span>
                </div>
                <div className="pl-4 text-white">);</div>
                <br/>
                <div className="text-gray-500 mb-2"># Result</div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check size={14} />
                  <span>PAYMENT_VERIFIED</span>
                </div>
                <div className="text-gray-400 mt-1">Resource unlocked for user.</div>
             </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ProcessSteps;