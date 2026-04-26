"use client";
import Navbar from '@/components/Navbar';
import ImpactMap from '@/components/ImpactMap';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TreePine, CheckCircle, Award, Globe } from 'lucide-react';

const projects = [
  { region:'Amazon Basin',     country:'Brazil',   trees:'12,541', verified:'11,890', nfts:'9,201',  status:'Active' },
  { region:'Congo Rainforest', country:'DRC',      trees:'8,210',  verified:'7,844',  nfts:'6,100',  status:'Active' },
  { region:'Borneo Highlands', country:'Malaysia', trees:'19,091', verified:'18,108', nfts:'14,200', status:'Active' },
];

const stats = [
  { icon:TreePine,    label:'Trees Planted',     value:'39,842' },
  { icon:CheckCircle, label:'Verified On-Chain',  value:'37,842' },
  { icon:Award,       label:'NFTs Minted',        value:'12,441' },
  { icon:Globe,       label:'Active Projects',    value:'127' },
];

export default function ImpactMapPage() {
  return (
    <main className="min-h-screen" style={{ background:'var(--bg)' }}>
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-10 px-6 max-w-7xl mx-auto">
        <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-5">Live Oracle Data</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-none th-text">
            GLOBAL<br />
            <span className="text-gold gold-text-glow">IMPACT</span><br />
            MAP.
          </h1>
          <div className="flex items-center gap-3 lg:pb-4">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] th-faint">Live · Updated every 30s</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:i*0.08 }}
              className="rounded-2xl p-5 th-card" style={{ border:'1px solid var(--border)' }}>
              <s.icon size={15} className="text-gold mb-3 opacity-70" />
              <p className="font-display text-3xl text-gold">{s.value}</p>
              <p className="text-[9px] uppercase tracking-widest mt-1 th-faint">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reuse the exact same ImpactMap component from home page */}
      <ImpactMap />

      {/* Projects table */}
      <section className="px-6 max-w-7xl mx-auto pb-24">
        <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-5 th-ghost">Active Projects</div>
        <div className="space-y-2">
          {projects.map((p, i) => (
            <motion.div key={p.region}
              initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.6, delay:i*0.1 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl px-7 py-5 transition-all hover:border-gold/20 th-card"
              style={{ border:'1px solid var(--border)' }}>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <div>
                  <p className="font-black text-sm uppercase tracking-tight th-text">{p.region}</p>
                  <p className="text-[9px] uppercase tracking-widest th-faint">{p.country}</p>
                </div>
              </div>
              <div className="flex gap-8">
                {[
                  { label:'Planted',  val:p.trees    },
                  { label:'Verified', val:p.verified  },
                  { label:'NFTs',     val:p.nfts      },
                ].map(col => (
                  <div key={col.label} className="text-center">
                    <p className="font-black text-sm text-gold">{col.val}</p>
                    <p className="text-[8px] uppercase tracking-widest th-ghost">{col.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-gold text-[9px] font-black uppercase tracking-widest">{p.status}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-center">
          <Link href="/" className="text-[9px] font-black uppercase tracking-widest th-ghost hover:text-gold transition-colors">
            ← Back to Home
          </Link>
          <Link href="/kyc"
            className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
            style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
            Become a Nature Hero
            <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ background:'var(--on-gold)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
