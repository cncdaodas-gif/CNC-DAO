"use client";
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';

const ANIMATION_RAW = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/c112765c654cf873839d5bbe08be178699a0bbc6/public/treant-animation.mp4";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-black p-3 md:p-5 noise-overlay">
      {/* Inner rounded container */}
      <div className="relative w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden">

        {/* Video background */}
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src={ANIMATION_RAW} type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />

        {/* Gold atmospheric glow */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gold/10 blur-[100px] rounded-full z-10" />

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-black/60 backdrop-blur-md text-gold text-[9px] font-black uppercase tracking-[0.25em]">
            <Zap size={10} fill="currentColor" />
            Solana Mainnet · Live 2026
          </div>
        </motion.div>

        {/* Bottom content — 12-col grid like Prisma */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 grid grid-cols-12 items-end gap-4">

          {/* Giant heading — left 8 cols */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="font-display leading-[0.85] tracking-tight" style={{ fontSize: 'clamp(4rem, 18vw, 22rem)', color: '#F5F0D8' }}>
                DECEN
              </div>
              <div className="font-display leading-[0.85] tracking-tight gold-text-glow" style={{ fontSize: 'clamp(4rem, 18vw, 22rem)', color: '#FFD700' }}>
                TRALIZ
              </div>
              <div className="font-display leading-[0.85] tracking-tight" style={{ fontSize: 'clamp(4rem, 18vw, 22rem)', color: '#F5F0D8' }}>
                ED<span className="text-gold">.</span>
              </div>
            </motion.div>
          </div>

          {/* Right col — description + CTA */}
          <div className="col-span-12 lg:col-span-4 pb-2 flex flex-col gap-5 lg:pl-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/50 text-sm leading-relaxed font-medium"
              style={{ lineHeight: 1.3 }}
            >
              CNC DAO is a Solana-based regenerative finance initiative rewarding tree planting, ecosystem restoration, and low-carbon practices through blockchain transparency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/kyc"
                className="group inline-flex items-center gap-3 bg-gold text-black pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
              >
                Get Verified
                <span className="bg-black rounded-full w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
              <Link
                href="/impact-map"
                className="inline-flex items-center gap-2 border border-white/15 text-white/60 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-gold/40 hover:text-gold transition-all backdrop-blur-sm"
              >
                View Impact
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
