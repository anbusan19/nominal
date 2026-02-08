
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal, Wallet } from 'lucide-react';
import { connectWallet } from '../lib/placeholderFunctions';

// 1. Define the PixelPlanet component first
const PixelPlanet = ({ color = "#a83a18" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Configuration
    const pixelSize = 3;
    const globeRadius = 500; // Larger for background

    // Resize logic
    const resize = () => {
      // Set high resolution for crisp pixels
      canvas.width = 2000;
      canvas.height = 2000;
    };
    resize();

    // Fibonacci Sphere Algorithm
    const createPoints = () => {
      const points = [];
      const count = 2500; 
      const goldenRatio = (1 + 5 ** 0.5) / 2;

      for (let i = 0; i < count; i++) {
        const theta = (2 * Math.PI * i) / goldenRatio;
        const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
        
        points.push({
          x: globeRadius * Math.sin(phi) * Math.cos(theta),
          y: globeRadius * Math.sin(phi) * Math.sin(theta),
          z: globeRadius * Math.cos(phi),
          baseX: globeRadius * Math.sin(phi) * Math.cos(theta),
          baseZ: globeRadius * Math.cos(phi),
        });
      }
      return points;
    };

    const points = createPoints();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      time += 0.002; // Slower Rotation

      points.forEach((point) => {
        // Rotation math (Y-axis)
        const x = point.baseX * Math.cos(time) - point.baseZ * Math.sin(time);
        const z = point.baseX * Math.sin(time) + point.baseZ * Math.cos(time);
        
        // Simple depth sorting/culling
        if (z < -globeRadius / 1.5) return;

        // Perspective scale & Alpha
        const scale = (z + globeRadius * 2) / (globeRadius * 2); // 0.5 to 1.5
        const alpha = (z + globeRadius) / (globeRadius * 2);
        
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.8, alpha));

        // Draw pixel
        ctx.fillRect(
            cx + x, 
            cy + point.y, 
            pixelSize * (z > 0 ? 1.2 : 1), 
            pixelSize * (z > 0 ? 1.2 : 1)
        );
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-contain mix-blend-screen opacity-50"
    />
  );
};

// 2. The Hero Component
const Hero = () => {
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const connectText = "Connect Wallet to Get Started";

  const handleCopy = () => {
    navigator.clipboard.writeText(connectText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const result = await connectWallet();
      setIsConnected(true);
      setWalletAddress(result.address);
      console.log('Wallet connected:', result);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black font-sans">
      
      {/* Background Planet - Centered & Large */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <div className="w-[100vw] h-[100vw] max-w-[2000px] max-h-[2000px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-[10%]">
             <div className="absolute inset-0 bg-brand-orange/10 blur-[150px] rounded-full" />
             <PixelPlanet color="#E84142" /> 
         </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
           <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-brand-orange font-mono text-sm tracking-[0.2em] mb-6 inline-block uppercase font-bold px-3 py-1 rounded border border-brand-orange/20 bg-brand-orange/10"
          >
            SOVEREIGN PAYROLL INFRASTRUCTURE
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold font-manrope leading-[1.1] mb-8 tracking-tight"
          >
            Nominal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500">
              Decentralized Payroll
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl"
          >
            Eliminate cross-border payment friction with ENS identity and automated stablecoin distribution. Bridge salaries to any chain in a single transaction.
          </motion.p>
          
          {/* Powered By Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Powered by</span>
            <div className="flex items-center gap-4 transition-all duration-300">
               <img src="/arc.svg" alt="Arc" className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
               <div className="h-4 w-px bg-white/10"></div>
               <img src="/ens-logo-Blue.svg" alt="ENS" className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
               <div className="h-4 w-px bg-white/10"></div>
               <img src="/logo_lifi_dark_horizontal.svg" alt="LI.FI" className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </section>
  );
};

export default Hero;
