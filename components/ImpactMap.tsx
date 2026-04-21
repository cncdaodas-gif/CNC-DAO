"use client";
import { Globe } from 'lucide-react';

export default function ImpactMap() {
  return (
    <section id="impact" className="py-32 bg-black">
      <div className="container mx-auto px-6 text-center mb-20">
        <h2 className="text-6xl font-black tracking-tighter uppercase mb-4">Impact <span className="text-[#FFD700]">Topography</span></h2>
        <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold">Real-time Oracle Verification Nodes</p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto h-[600px] bg-[#080808] rounded-[60px] border border-white/5 overflow-hidden flex items-center justify-center">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FFD700 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        
        {/* Impact Pings */}
        <Ping top="30%" left="25%" name="Amazon Project" count="12.5k" />
        <Ping top="50%" left="55%" name="Congo Basin" count="8.2k" />
        <Ping top="45%" left="82%" name="Southeast Asia" count="19.1k" />

        <div className="absolute bottom-10 right-10 bg-black/80 backdrop-blur-md p-6 border border-white/10 rounded-3xl">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Global Coverage</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            <p className="text-white font-black text-2xl tracking-tighter">39,842 verified trees</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ping({ top, left, name, count }: any) {
  return (
    <div className="absolute" style={{ top, left }}>
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#FFD700] opacity-40 scale-150" />
        <div className="w-4 h-4 bg-[#FFD700] rounded-full shadow-[0_0_20px_#FFD700]" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 p-2 rounded whitespace-nowrap">
           <p className="text-white font-bold text-[10px]">{name}</p>
           <p className="text-[#FFD700] font-black text-[9px]">{count} TREES</p>
        </div>
      </div>
    </div>
  );
}
