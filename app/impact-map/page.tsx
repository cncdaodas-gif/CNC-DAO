"use client";
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Globe, Zap, TreePine, CheckCircle, Award } from 'lucide-react';
import Link from 'next/link';

const projects = [
  { region: 'Amazon Basin', country: 'Brazil', trees: '12,541', verified: '11,890', nfts: '9,201', status: 'Active', top: '58%', left: '24%' },
  { region: 'Congo Rainforest', country: 'DRC', trees: '8,210', verified: '7,844', nfts: '6,100', status: 'Active', top: '52%', left: '51%' },
  { region: 'Borneo Highlands', country: 'Malaysia', trees: '19,091', verified: '18,108', nfts: '14,200', status: 'Active', top: '46%', left: '78%' },
];

const stats = [
  { icon: TreePine, label: 'Trees Planted', value: '39,842' },
  { icon: CheckCircle, label: 'Verified On-Chain', value: '37,842' },
  { icon: Award, label: 'NFTs Minted', value: '12,441' },
  { icon: Globe, label: 'Active Projects', value: '127' },
];

function Ping({ top, left, name, count, delay }: any) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 rounded-full bg-gold opacity-30 animate-ping-slow" />
        <div className="w-5 h-5 bg-gold rounded-full shadow-[0_0_25px_#FFD700,0_0_50px_rgba(255,215,0,0.3)]" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black border border-gold/30 px-4 py-3 rounded-xl whitespace-nowrap z-20 pointer-events-none">
          <p className="text-white font-black text-[11px] uppercase tracking-wider">{name}</p>
          <p className="text-gold font-black text-[10px]">{count} TREES</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ImpactMapPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-10 px-6 max-w-7xl mx-auto">
        <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-5">Live Oracle Data</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] text-white leading-none">
            GLOBAL<br />
            <span className="text-gold gold-text-glow">IMPACT</span><br />
            MAP.
          </h1>
          <div className="flex items-center gap-3 lg:pb-4">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
              Live · Updated every 30s
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5"
            >
              <s.icon size={16} className="text-gold mb-3 opacity-70" />
              <p className="font-display text-3xl text-gold">{s.value}</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full-width map */}
      <section className="px-6 max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[520px] md:h-[620px] bg-[#060606] rounded-[2rem] border border-white/5 overflow-hidden gold-glow"
        >
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: 'radial-gradient(#FFD700 0.6px, transparent 0.6px)', backgroundSize: '30px 30px' }}
          />
          {/* Scan lines */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #FFD700, #FFD700 1px, transparent 1px, transparent 36px)' }}
          />

          {/* Atmospheric glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full" />

          {/* Corner label */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <Globe size={16} className="text-gold/30" />
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Earth · 2026</span>
          </div>

          {/* Pings */}
          {projects.map((p, i) => (
            <Ping key={p.region} top={p.top} left={p.left} name={p.region} count={p.trees} delay={i * 0.3} />
          ))}

          {/* Scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent"
            animate={{ top: ['5%', '95%', '5%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />

          {/* Bottom right stat */}
          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md px-6 py-4 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Total Verified</p>
            </div>
            <p className="font-display text-3xl text-gold">39,842</p>
            <p className="text-white/20 text-[9px] uppercase tracking-widest">trees on-chain</p>
          </div>
        </motion.div>
      </section>

      {/* Projects table */}
      <section className="px-6 max-w-7xl mx-auto pb-24">
        <div className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-5">Active Projects</div>
        <div className="space-y-2">
          {projects.map((p, i) => (
            <motion.div
              key={p.region}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-wrap items-center justify-between gap-4 bg-[#0d0d0d] border border-white/8 rounded-2xl px-7 py-5 hover:border-gold/20 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-tight">{p.region}</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest">{p.country}</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-gold font-black text-sm">{p.trees}</p>
                  <p className="text-white/25 text-[8px] uppercase tracking-widest">Planted</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-black text-sm">{p.verified}</p>
                  <p className="text-white/25 text-[8px] uppercase tracking-widest">Verified</p>
                </div>
                <div className="text-center">
                  <p className="text-white/60 font-black text-sm">{p.nfts}</p>
                  <p className="text-white/25 text-[8px] uppercase tracking-widest">NFTs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-gold text-[9px] font-black uppercase tracking-widest">{p.status}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-center">
          <Link href="/" className="text-white/20 text-[9px] font-black uppercase tracking-widest hover:text-gold transition-colors">
            ← Back to Home
          </Link>
          <Link
            href="/kyc"
            className="group inline-flex items-center gap-3 bg-gold text-black pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
          >
            Become a Nature Hero
            <span className="bg-black rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
