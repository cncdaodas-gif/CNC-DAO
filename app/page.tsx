import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import KYC from '@/components/KYC';
import Ecosystem from '@/components/Ecosystem'; // You can create this similarly to KYC
import ImpactMap from '@/components/ImpactMap';

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <KYC />
      <ImpactMap />
      {/* Governance & Footer Sections */}
    </main>
  );
}
