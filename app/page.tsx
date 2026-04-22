import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import KYC from '@/components/KYC';
import ImpactMap from '@/components/ImpactMap';
import TreeSubmissionForm from '@/components/TreeSubmissionForm';
import Link from 'next/link';

export default function Home() {
  return (
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

      {/* Governance / CTA Section */}
      <section id="governance" className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
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
            <Link
              href="/kyc"
              className="group inline-flex items-center gap-3 bg-gold text-black pl-7 pr-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
            >
              Start KYC Verification
              <span className="bg-black rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <Link
              href="/impact-map"
              className="inline-flex items-center gap-2 border border-white/15 text-white/60 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-gold/40 hover:text-gold transition-all"
            >
              View Impact Map
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-white/5 text-center text-white/15 text-[9px] font-black tracking-[0.5em] uppercase">
        © 2026 CNC DAO — Transparent Climate Action on Solana
      </footer>
    </main>
  );
}
