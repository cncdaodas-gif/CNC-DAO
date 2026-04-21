"use client";
import React from 'react';

export default function Navbar() {
  const LOGO_RAW = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg";

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 backdrop-blur-xl bg-black/60 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-[#FFD700]">
          <img src={LOGO_RAW} alt="CNC DAO" className="object-cover w-full h-full" />
        </div>
        <span className="text-white font-black text-xl tracking-tighter uppercase">CNC DAO</span>
      </div>

      <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
        <a href="#mission" className="hover:text-[#FFD700] transition-colors">Mission</a>
        <a href="#ecosystem" className="hover:text-[#FFD700] transition-colors">Ecosystem</a>
        <a href="#impact" className="hover:text-[#FFD700] transition-colors">Impact</a>
        <a href="#governance" className="hover:text-[#FFD700] transition-colors">Governance</a>
      </div>

      <button className="bg-white hover:bg-[#FFD700] text-black px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all hover:scale-105">
        Connect Wallet
      </button>
    </nav>
  );
}
