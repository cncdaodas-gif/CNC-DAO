"use client";
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

const features = [
  {
    title: "Biometric Identity",
    icon: Fingerprint,
    desc: "Proof-of-personhood to ensure one human per reward. No bots, no duplicates.",
    num: "01",
  },
  {
    title: "Solana Wallet Binding",
    icon: ShieldCheck,
    desc: "Immutable linkage of climate impact to your unique on-chain address.",
    num: "02",
  },
  {
    title: "ZK-Privacy",
    icon: Lock,
    desc: "Verify identity without revealing sensitive private data. Zero-knowledge proof.",
    num: "03",
  },
];

export default function KYC() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="mission" className="py-24 bg-black border-t border-white/5 bg-noise relative overflow-hidden">
      {/* Subtle gold grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#FFD700 0.5px, transparent 0.5px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">Verification Layer</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-none">
              SYBIL<br />
              <span className="text-gold gold-text-glow">RESISTANT</span><br />
              IMPACT.
            </h2>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
              Our KYC layer prevents bot farming and maintains the integrity of the carbon-credit ecosystem. Every reward goes to a real person planting a real tree.
            </p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div ref={ref} className="grid md:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 hover:border-gold/30 transition-colors overflow-hidden"
            >
              {/* Card number */}
              <div className="absolute top-5 right-6 font-display text-5xl text-white/5 group-hover:text-gold/10 transition-colors">
                {f.num}
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-5 group-hover:bg-gold/15 transition-colors">
                <f.icon size={18} />
              </div>

              <h3 className="font-black text-white uppercase tracking-tight text-sm mb-2">{f.title}</h3>
              <p className="text-white/35 text-xs leading-relaxed">{f.desc}</p>

              <div className="mt-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gold/50 group-hover:text-gold transition-colors">
                Learn more
                <ArrowRight size={10} className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex items-center justify-between"
        >
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
            Powered by Worldcoin · zkPass · Solana
          </p>
          <Link
            href="/kyc"
            className="group inline-flex items-center gap-3 bg-gold text-black pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
          >
            Verify Now
            <span className="bg-black rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
