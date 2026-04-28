"use client";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ShieldCheck, Fingerprint, Lock, CheckCircle, ArrowLeft } from 'lucide-react';


const steps = [
  { num:'01', title:'Connect Wallet',      icon:ShieldCheck,  desc:'Link your Solana wallet (Phantom, Solflare) to begin the verification process.' },
  { num:'02', title:'Biometric Scan',      icon:Fingerprint,  desc:'Complete a quick liveness check powered by Worldcoin or zkPass to prove you are a real human.' },
  { num:'03', title:'ZK-Proof Generated',  icon:Lock,         desc:'A zero-knowledge proof is generated and anchored on-chain — your identity stays private.' },
  { num:'04', title:'Verified Nature Hero',icon:CheckCircle,  desc:'You are now a verified Nature Hero. Start validating tree submissions and earning CNC tokens.' },
];

const benefits = [
  'Validate tree planting submissions',
  'Earn CNC tokens per approved review',
  'Access exclusive Nature Hero dashboard',
  'Vote on governance proposals',
  'Priority NFT minting access',
  'Satellite data review tools',
];

export default function KYCPage() {
  return (
    <main className="min-h-screen" style={{ background:'var(--bg)' }}>
      <Navbar />

      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto">

        {/* ── Back to Home ── */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-widest transition-all group"
          style={{ color:'var(--text-faint)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
        >
          <span className="w-8 h-8 rounded-full flex items-center justify-center border transition-all group-hover:border-gold/40"
            style={{ borderColor:'var(--border)' }}>
            <ArrowLeft size={13} />
          </span>
          Back to Home
        </Link>

        {/* ── Header ── */}
        <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-5">Identity Verification</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-none th-text">
            VERIFY<br />
            <span className="text-gold gold-text-glow">YOUR</span><br />
            IDENTITY.
          </h1>
          <p className="text-sm max-w-xs leading-relaxed lg:text-right lg:pb-4 font-medium th-dim">
            Join the CNC DAO network as a verified Nature Hero. Our KYC layer prevents Sybil attacks and ensures every reward reaches a real person doing real climate work.
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {steps.map(step => (
            <div key={step.num}
              className="group relative rounded-2xl p-7 overflow-hidden transition-all hover:border-gold/30"
              style={{ background:'var(--bg-card)', border:'1px solid var(--border)' }}
            >
              <div className="absolute top-5 right-6 font-display text-5xl transition-colors"
                style={{ color:'var(--border)' }}>{step.num}</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold mb-5"
                style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                <step.icon size={18} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm mb-2 th-text">{step.title}</h3>
              <p className="text-xs leading-relaxed th-faint">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ── CTA + Benefits ── */}
        <div className="grid lg:grid-cols-2 gap-3">

          {/* Gold CTA card */}
          <div className="rounded-2xl p-10 flex flex-col justify-between min-h-[320px]"
            style={{ background:'var(--gold)' }}>
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-4"
                style={{ color:'rgba(0,0,0,0.45)' }}>Get Started</div>
              <h2 className="font-display text-5xl md:text-6xl leading-none mb-6"
                style={{ color:'var(--on-gold)' }}>
                BECOME A<br />NATURE HERO.
              </h2>
              <p className="text-sm leading-relaxed max-w-sm"
                style={{ color:'rgba(0,0,0,0.55)' }}>
                The entire process takes under 3 minutes. Your identity data never leaves your device.
              </p>
            </div>
            <Link
              href="/kyc-apply"
              className="self-start mt-8 group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
              style={{ background:'var(--on-gold)', color:'var(--gold)' }}
            >
              Start Verification
              <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background:'var(--gold)' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="var(--on-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>

          {/* Benefits card */}
          <div className="rounded-2xl p-10 th-card" style={{ border:'1px solid var(--border)' }}>
            <div className="text-gold text-[9px] font-black uppercase tracking-[0.3em] mb-6">Nature Hero Benefits</div>
            <ul className="space-y-4">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-3 text-sm th-sec">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 flex items-center gap-3" style={{ borderTop:'1px solid var(--border-sm)' }}>
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-widest th-ghost">127 Nature Heroes Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by */}
      <section className="py-10" style={{ borderTop:'1px solid var(--border-sm)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] th-ghost">Identity powered by</p>
          <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest th-ghost">
            {['Worldcoin','zkPass','Solana','IPFS'].map(p => (
              <span key={p} className="hover:text-gold transition-colors cursor-pointer">{p}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
