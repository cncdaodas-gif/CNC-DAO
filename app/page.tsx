"use client";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import KYC from '@/components/KYC';
import ImpactMap from '@/components/ImpactMap';
import NFTSection from '@/components/NFTSection';
import TreeSubmissionForm from '@/components/TreeSubmissionForm';
import Footer from '@/components/Footer';
import AnimatedImage from '@/components/AnimatedImage';
import CyberpunkScene from '@/components/CyberpunkScene';
import Link from 'next/link';

const IMG_LEAVES   = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/leaves%20at%20sunset.JPG";
const IMG_PALMS    = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/palm%20trees.JPG";
const IMG_PALM     = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/palm.jpg";
const IMG_MIDJ     = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/Midjourney.jpg";
const IMG_STRAY    = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/Stray%20Game%20Background%20Hd.jpg";

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <Hero />
      <KYC />
      <ImpactMap />

      {/* ── NFT Section — Midjourney image animated behind it ── */}
      <div className="relative">
        {/* Midjourney nature art — Ken Burns zoom, very visible */}
        <AnimatedImage
          src={IMG_MIDJ}
          variant="kenburns"
          opacity={0.32}
          className="absolute inset-0 w-full h-full"
        />
        <NFTSection />
      </div>

      {/* ── Submit Tree — leaves at sunset + particle network ── */}
      <div className="relative" style={{ background: 'var(--bg)' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG_LEAVES})`,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          opacity: 0.06, mixBlendMode: 'luminosity' as any,
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, var(--bg) 85%)',
        }} />
        <TreeSubmissionForm />
      </div>

      {/* ── Ecosystem — palm.jpg right side ── */}
      <section id="ecosystem" className="relative overflow-hidden py-24 border-t"
        style={{ background: 'var(--bg)', borderColor: 'var(--border-sm)' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '55%',
          backgroundImage: `url(${IMG_PALM})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.55,
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to right, var(--bg) 0%, var(--bg) 38%, rgba(0,0,0,0.3) 60%, transparent 100%)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 10%, transparent 90%, var(--bg) 100%)',
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">Built on Solana</div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-16 th-text">
            THE<br /><span className="text-gold gold-text-glow">ECOSYSTEM</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-3 lg:w-[60%]">
            {[
              { num:'01', title:'Tree Registry',  desc:'Every planted tree anchored permanently on the Solana blockchain with GPS + timestamp.' },
              { num:'02', title:'NFT Identity',   desc:'1 Verified Tree = 1 Digital Identity. Each surviving tree minted as a unique NFT.' },
              { num:'03', title:'Nature Heroes',  desc:'Human-in-the-loop validation. 2 independent validators must approve each submission.' },
              { num:'04', title:'Impact Map',     desc:'Global map of all planting activity, verification status, and project density.' },
            ].map(item => (
              <div key={item.num}
                className="group rounded-2xl p-7 transition-all hover:border-gold/30"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--border)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}>
                <div className="font-display text-5xl text-gold/15 group-hover:text-gold/35 transition-colors mb-6">{item.num}</div>
                <h3 className="font-black uppercase tracking-tight text-sm mb-3 th-text">{item.title}</h3>
                <p className="text-xs leading-relaxed th-faint">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join the Movement — Stray Game cyberpunk animated background ── */}
      <section id="governance" className="border-t relative overflow-hidden"
        style={{ borderColor: 'var(--border-sm)', minHeight: '600px' }}>

        {/* CyberpunkScene fills the whole section — rain + glow + scan lines */}
        <CyberpunkScene
          src={IMG_STRAY}
          opacity={0.5}
          className="absolute inset-0 w-full h-full"
        />

        <div className="relative z-10 py-24 max-w-4xl mx-auto px-6 text-center">
          <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-6">Join the Movement</div>
          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl leading-none mb-8 th-text">
            PLANT.<br />
            <span className="text-gold gold-text-glow">VERIFY.</span><br />
            EARN.
          </h2>
          <p className="text-sm leading-relaxed max-w-lg mx-auto mb-12 font-semibold th-sec">
            Become a Nature Hero. Validate tree submissions, earn CNC tokens, and help build a transparent climate-action economy on Solana.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/kyc"
              className="group inline-flex items-center gap-3 pl-7 pr-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
              style={{ background: 'var(--gold)', color: 'var(--on-gold)' }}>
              Start KYC Verification
              <span className="rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: 'var(--on-gold)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <Link href="/#submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:text-gold backdrop-blur-sm"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
              Submit a Tree
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
