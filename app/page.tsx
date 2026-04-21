import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import KYC from '@/components/KYC';
import ImpactMap from '@/components/ImpactMap';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />
      <Hero />
      <KYC />
      <ImpactMap />
      
      {/* Ecosystem Placeholder to prevent build errors */}
      <section id="ecosystem" className="py-20 bg-[#080808] text-center">
        <h2 className="text-[#FFD700] font-black text-3xl uppercase tracking-tighter">Ecosystem</h2>
        <p className="text-white/40 mt-2">Built on Solana for the future of Earth.</p>
      </section>

      <footer className="py-10 border-t border-white/5 text-center text-white/20 text-[10px] font-bold tracking-[0.5em] uppercase">
        © 2024 CNC DAO — Transparent Climate Action
      </footer>
    </main>
  );
}
