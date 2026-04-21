"use client";
import { ShieldCheck, Fingerprint, Lock } from 'lucide-react';

export default function KYC() {
  const features = [
    { title: "Biometric Identity", icon: <Fingerprint />, desc: "Proof-of-personhood to ensure one human per reward." },
    { title: "Solana Wallet Binding", icon: <ShieldCheck />, desc: "Immutable linkage of climate impact to your unique address." },
    { title: "ZK-Privacy", icon: <Lock />, desc: "Verify identity without revealing sensitive private data." }
  ];

  return (
    <section className="py-32 bg-[#050505] border-y border-white/5">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-[#FFD700] text-5xl font-black tracking-tighter mb-8 italic uppercase">Sybil Resistant <br/>Impact.</h2>
          <p className="text-white/40 text-lg leading-relaxed mb-8">
            CNC DAO uses advanced identity verification to ensure that rewards go to real people planting real trees. Our KYC layer prevents bot farming and maintains the integrity of the carbon-credit ecosystem.
          </p>
          <button className="border border-[#FFD700] text-[#FFD700] px-8 py-3 rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-all">Verify Now</button>
        </div>
        <div className="space-y-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 bg-black border border-white/10 rounded-2xl flex gap-6 items-start hover:border-[#FFD700]/40 transition-colors">
              <div className="text-[#FFD700]">{f.icon}</div>
              <div>
                <h4 className="font-bold text-white mb-2 uppercase tracking-tighter">{f.title}</h4>
                <p className="text-white/30 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
