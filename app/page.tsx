"use client";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import KYC from '@/components/KYC';
import ImpactMap from '@/components/ImpactMap';
import TreeSubmissionForm from '@/components/TreeSubmissionForm';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

// Your two images — assigned to sections
// Image 1 (tree photo) → Submit Tree section (handled inside TreeSubmissionForm)
// Image 2 → Join the Movement / Governance section
const IMAGE_2 = "https://drive.google.com/uc?export=view&id=1VS3jugaT0gNh8hTbYwNNae1Blo5qqwq-";
// Replace IMAGE_2 with the second image ID once you share it

export default function Home() {
  const [light, setLight] = useState(false);

  return (
    <div className={light ? 'light-mode' : ''}>
      <style>{`
        .light-mode {
          --bg: #f5f0e8;
          --surface: #ede8dc;
          --text: #1a1a1a;
          --text-dim: rgba(0,0,0,0.5);
          --border: rgba(0,0,0,0.1);
        }
        .light-mode main { background: var(--bg); }
        .light-mode .lm-bg { background: var(--bg) !important; }
        .light-mode .lm-surface { background: var(--surface) !important; }
        .light-mode .lm-text { color: var(--text) !important; }
        .light-mode .lm-text-dim { color: var(--text-dim) !important; }
        .light-mode .lm-border { border-color: var(--border) !important; }
        .light-mode .lm-card { background: var(--surface) !important; border-color: rgba(0,0,0,0.08) !important; }
        .light-mode section { background: var(--bg) !important; }
        .light-mode h1, .light-mode h2, .light-mode h3, .light-mode p { color: var(--text) !important; }
        .light-mode .text-white\\/40, .light-mode .text-white\\/30, .light-mode .text-white\\/50 { color: rgba(0,0,0,0.45) !important; }
        .light-mode .text-white\\/20, .light-mode .text-white\\/15 { color: rgba(0,0,0,0.25) !important; }
        .light-mode .text-white { color: #1a1a1a !important; }
        .light-mode .bg-\\[\\#0d0d0d\\], .light-mode .bg-\\[\\#050505\\], .light-mode .bg-\\[\\#080808\\] { background: var(--surface) !important; }
        .light-mode .border-white\\/8, .light-mode .border-white\\/5, .light-mode .border-white\\/10 { border-color: rgba(0,0,0,0.08) !important; }
        .light-mode input, .light-mode textarea { background: rgba(0,0,0,0.05) !important; border-color: rgba(0,0,0,0.12) !important; color: #1a1a1a !important; }
        .light-mode input::placeholder, .light-mode textarea::placeholder { color: rgba(0,0,0,0.3) !important; }
      `}</style>

      {/* Light mode toggle — fixed bottom right */}
      <button
        onClick={() => setLight(!light)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gold text-black flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        title={light ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {light ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <main className="relative min-h-screen bg-black">
        <Navbar />
        <Hero />
        <KYC />
        <ImpactMap />
        <TreeSubmissionForm />

        {/* Ecosystem Section */}
        <section id="ecosystem" className="py-24 bg-black border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">Built on Solana</div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-16">
              THE<br /><span className="text-gold gold-text-glow">ECOSYSTEM</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { num: '01', title: 'Tree Registry', desc: 'Every planted tree anchored permanently on the Solana blockchain with GPS + timestamp.' },
                { num: '02', title: 'NFT Identity', desc: '1 Verified Tree = 1 Digital Identity. Each surviving tree minted as a unique NFT.' },
                { num: '03', title: 'Nature Heroes', desc: 'Human-in-the-loop validation. Minimum 2 independent validators must approve each submission.' },
                { num: '04', title: 'Impact Map', desc: 'Global map visualisation of all planting activity, verification status, and project density.' },
              ].map((item) => (
                <div key={item.num} className="group bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 hover:border-gold/25 transition-colors">
                  <div className="font-display text-5xl text-gold/10 group-hover:text-gold/20 transition-colors mb-6">{item.num}</div>
                  <h3 className="font-black text-white uppercase tracking-tight text-sm mb-3">{item.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join the Movement — with background image */}
        <section id="governance" className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
          {/* Background image blended */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08]"
            style={{ backgroundImage: `url(${IMAGE_2})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(#FFD700 0.5px, transparent 0.5px)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-6">Join the Movement</div>
            <h2 className="font-display text-6xl md:text-8xl lg:text-9xl text-white leading-none mb-8">
              PLANT.<br />
              <span className="text-gold gold-text-glow">VERIFY.</span><br />
              EARN.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto mb-12">
              Become a Nature Hero. Validate tree submissions, earn CNC tokens, and help build a transparent climate-action economy on Solana.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/kyc"
                className="group inline-flex items-center gap-3 bg-gold text-black pl-7 pr-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">
                Start KYC Verification
                <span className="bg-black rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
              <Link href="/#submit"
                className="inline-flex items-center gap-2 border border-white/15 text-white/60 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-gold/40 hover:text-gold transition-all">
                Submit a Tree
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
