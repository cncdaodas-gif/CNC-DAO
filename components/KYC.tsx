"use client";
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

const features = [
  { title:"Biometric Identity",    icon:Fingerprint, desc:"Proof-of-personhood to ensure one human per reward. No bots, no duplicates.", num:"01" },
  { title:"Solana Wallet Binding", icon:ShieldCheck,  desc:"Immutable linkage of climate impact to your unique on-chain address.",        num:"02" },
  { title:"ZK-Privacy",            icon:Lock,         desc:"Verify identity without revealing sensitive private data. Zero-knowledge proof.", num:"03" },
];

export default function KYC() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-80px' });

  return (
    <section id="mission" className="py-24 border-t relative overflow-hidden"
      style={{ background:'var(--bg)', borderColor:'var(--border-sm)' }}>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage:'radial-gradient(#FFD700 0.5px,transparent 0.5px)', backgroundSize:'28px 28px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }} className="mb-16">
          <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">Verification Layer</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none" style={{ color:'var(--text-pri)' }}>
              SYBIL<br />
              <span className="text-gold gold-text-glow">RESISTANT</span><br />
              IMPACT.
            </h2>
            {/* BOLD as requested */}
            <p className="text-sm leading-relaxed font-bold max-w-sm md:text-right" style={{ color:'var(--text-sec)' }}>
              Our KYC layer prevents bot farming and maintains the integrity of the carbon-credit ecosystem.
              Every reward goes to a real person planting a real tree.
            </p>
          </div>
        </motion.div>

        {/* Cards */}
        <div ref={ref} className="grid md:grid-cols-3 gap-3">
          {features.map((f,i) => (
            <motion.div key={f.num}
              initial={{ opacity:0, scale:0.95, y:20 }}
              animate={inView ? { opacity:1, scale:1, y:0 } : {}}
              transition={{ duration:0.7, delay:i*0.15, ease:[0.22,1,0.36,1] }}
              className="group relative rounded-2xl p-7 overflow-hidden transition-all"
              style={{ background:'var(--bg-card)', border:'1px solid var(--border)' }}
            >
              <div className="absolute top-5 right-6 font-display text-5xl" style={{ color:'var(--border)' }}>{f.num}</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold mb-5"
                style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                <f.icon size={18} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm mb-2" style={{ color:'var(--text-pri)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color:'var(--text-faint)' }}>{f.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gold/50 group-hover:text-gold transition-colors">
                Learn more <ArrowRight size={10} className="-rotate-45" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.7, delay:0.5 }} className="mt-10 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color:'var(--text-ghost)' }}>
            Powered by Worldcoin · zkPass · Solana
          </p>
          <Link href="/kyc"
            className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
            style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
            Verify Now
            <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ background:'var(--on-gold)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
