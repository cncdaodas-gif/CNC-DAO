"use client";
import { motion, useInView } from 'framer-motion';
import { Globe, Zap } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

const pings = [
  { top: '28%', left: '22%', name: 'Amazon Project', count: '12.5k', delay: 0 },
  { top: '48%', left: '52%', name: 'Congo Basin', count: '8.2k', delay: 0.3 },
  { top: '38%', left: '78%', name: 'Southeast Asia', count: '19.1k', delay: 0.6 },
];

function Ping({ top, left, name, count, delay }: any) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 rounded-full bg-gold opacity-30 animate-ping-slow" />
        <div className="w-4 h-4 bg-gold rounded-full shadow-[0_0_20px_#FFD700,0_0_40px_rgba(255,215,0,0.3)]" />
        <div className="absolute top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-gold/20 px-3 py-2 rounded-xl whitespace-nowrap z-10">
          <p className="text-white font-black text-[10px] uppercase tracking-wider">{name}</p>
          <p className="text-gold font-black text-[9px]">{count} TREES</p>
        </div>
      </div>
    </motion.div>
  );
}

const stats = [
  { label: 'Trees Verified', value: '39,842' },
  { label: 'Active Projects', value: '127' },
  { label: 'NFTs Minted', value: '12,441' },
];

export default function ImpactMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="impact" className="py-24 bg-[#050505] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">Live Oracle Data</div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-none">
              GLOBAL<br />
              <span className="text-gold gold-text-glow">TOPOGRAPHY</span>
            </h2>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold max-w-[200px] md:text-right">
            Real-time oracle<br />verification nodes
          </p>
        </motion.div>

        {/* Map container */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[420px] md:h-[520px] bg-[#080808] rounded-[2rem] border border-white/5 overflow-hidden gold-glow"
        >
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(#FFD700 0.6px, transparent 0.6px)', backgroundSize: '32px 32px' }}
          />

          {/* Horizontal scan lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #FFD700, #FFD700 1px, transparent 1px, transparent 40px)' }}
          />

          {/* Gold center glow */}
          <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent opacity-60" />

          {/* Globe icon */}
          <div className="absolute top-6 left-6 text-white/10">
            <Globe size={40} />
          </div>

          {/* Pings */}
          {pings.map((p) => (
            <Ping key={p.name} {...p} />
          ))}

          {/* Stats overlay */}
          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md p-5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Live Network</p>
            </div>
            <div className="flex gap-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-gold font-black text-xl tracking-tighter">{s.value}</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scan line animation */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/impact-map"
            className="group inline-flex items-center gap-3 border border-white/10 text-white/50 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-gold/30 hover:text-gold transition-all"
          >
            Explore Full Map
            <span className="border border-white/10 rounded-full w-8 h-8 flex items-center justify-center group-hover:border-gold/40 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
