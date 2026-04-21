"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

export default function Hero() {
  const ANIMATION_RAW = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/c112765c654cf873839d5bbe08be178699a0bbc6/public/treant-animation.mp4";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-bold uppercase tracking-widest mb-6">
            <Zap size={12} fill="currentColor" /> Solana Mainnet 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            DECENTRALIZED <br /><span className="text-[#FFD700]">REGENERATION.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 uppercase tracking-wide font-medium">
            Rewarding real-world environmental action with on-chain transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#FFD700] text-black px-10 py-5 rounded-md font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Get Verified</button>
            <button className="bg-white/5 border border-white/10 backdrop-blur-md px-10 py-5 rounded-md font-black uppercase tracking-widest text-xs hover:bg-white/10">Read Docs</button>
          </div>
        </motion.div>
      </div>

      {/* The Treant Video */}
      <div className="absolute bottom-[-15%] w-full h-[85vh] z-10 pointer-events-none flex justify-center">
        <video autoPlay loop muted playsInline className="w-full h-full object-contain opacity-80">
          <source src={ANIMATION_RAW} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-[20%] w-[60%] h-[30%] bg-[#FFD700]/10 blur-[120px] rounded-full" />
      </div>
    </section>
  );
}
