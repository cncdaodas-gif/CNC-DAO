import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ShieldCheck, Fingerprint, Lock, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'KYC Verification — CNC DAO',
  description: 'Complete identity verification to become a Nature Hero and earn CNC rewards.',
};

const steps = [
  {
    num: '01',
    title: 'Connect Wallet',
    desc: 'Link your Solana wallet (Phantom, Solflare, etc.) to begin the verification process.',
    icon: ShieldCheck,
    done: false,
  },
  {
    num: '02',
    title: 'Biometric Scan',
    desc: 'Complete a quick liveness check powered by Worldcoin or zkPass to prove you are a real human.',
    icon: Fingerprint,
    done: false,
  },
  {
    num: '03',
    title: 'ZK-Proof Generated',
    desc: 'A zero-knowledge proof is generated and anchored on-chain — your identity stays private.',
    icon: Lock,
    done: false,
  },
  {
    num: '04',
    title: 'Verified Nature Hero',
    desc: 'You are now a verified Nature Hero. Start validating tree submissions and earning CNC tokens.',
    icon: CheckCircle,
    done: false,
  },
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
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-5">Identity Verification</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[10rem] text-white leading-none">
            VERIFY<br />
            <span className="text-gold gold-text-glow">YOUR</span><br />
            IDENTITY.
          </h1>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed lg:text-right lg:pb-4">
            Join the CNC DAO network as a verified Nature Hero. Our KYC layer prevents Sybil attacks and ensures every reward reaches a real person doing real climate work.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 hover:border-gold/30 transition-colors overflow-hidden"
            >
              <div className="absolute top-5 right-6 font-display text-5xl text-white/4 group-hover:text-gold/8 transition-colors">
                {step.num}
              </div>
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-5">
                <step.icon size={18} />
              </div>
              <h3 className="font-black text-white uppercase tracking-tight text-sm mb-2">{step.title}</h3>
              <p className="text-white/30 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Main CTA card */}
        <div className="grid lg:grid-cols-2 gap-3">
          {/* Left — CTA */}
          <div className="bg-gold rounded-2xl p-10 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="text-black/50 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Get Started</div>
              <h2 className="font-display text-5xl md:text-6xl text-black leading-none mb-6">
                BECOME A<br />NATURE HERO.
              </h2>
              <p className="text-black/60 text-sm leading-relaxed max-w-sm">
                The entire process takes under 3 minutes. Your identity data never leaves your device.
              </p>
            </div>
            <button className="self-start mt-8 group inline-flex items-center gap-3 bg-black text-gold pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">
              Start Verification
              <span className="bg-gold rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>

          {/* Right — Benefits */}
          <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-10">
            <div className="text-gold text-[9px] font-black uppercase tracking-[0.3em] mb-6">Nature Hero Benefits</div>
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/60 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">127 Nature Heroes Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">Identity powered by</p>
          <div className="flex items-center gap-8 text-white/20 text-[9px] font-black uppercase tracking-widest">
            <span className="hover:text-white/40 transition-colors cursor-pointer">Worldcoin</span>
            <span className="hover:text-white/40 transition-colors cursor-pointer">zkPass</span>
            <span className="hover:text-white/40 transition-colors cursor-pointer">Solana</span>
            <span className="hover:text-white/40 transition-colors cursor-pointer">IPFS</span>
          </div>
          <Link href="/" className="text-white/20 text-[9px] font-black uppercase tracking-widest hover:text-gold transition-colors">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
