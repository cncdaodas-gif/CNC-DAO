"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const LOGO_RAW = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop: pill hanging from top center */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-black rounded-b-3xl px-8 py-3 flex items-center gap-12 border-x border-b border-white/10 backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/40">
              <img src={LOGO_RAW} alt="CNC DAO" className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-white text-lg tracking-wider">CNC DAO</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Mission', href: '/#mission' },
              { label: 'Ecosystem', href: '/#ecosystem' },
              { label: 'Impact', href: '/impact-map' },
              { label: 'Governance', href: '/#governance' },
              { label: 'KYC', href: '/kyc' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/kyc"
            className="hidden md:flex items-center gap-2 bg-gold text-black pl-5 pr-2 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all group"
          >
            Connect Wallet
            <span className="bg-black rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/60 hover:text-gold transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {[
            { label: 'Mission', href: '/#mission' },
            { label: 'Ecosystem', href: '/#ecosystem' },
            { label: 'Impact Map', href: '/impact-map' },
            { label: 'Governance', href: '/#governance' },
            { label: 'KYC Verify', href: '/kyc' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl text-white/70 hover:text-gold transition-colors tracking-widest"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/kyc"
            onClick={() => setMenuOpen(false)}
            className="mt-4 bg-gold text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest"
          >
            Connect Wallet
          </Link>
        </div>
      )}
    </>
  );
}
