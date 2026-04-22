"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Sun, Moon } from 'lucide-react';

const LOGO_RAW = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg";

function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function useLightMode() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('cnc_light_mode');
    if (stored === 'true') {
      setLight(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);
  const toggle = () => {
    const next = !light;
    setLight(next);
    localStorage.setItem('cnc_light_mode', String(next));
    document.documentElement.setAttribute('data-theme', next ? 'light' : 'dark');
  };
  return { light, toggle };
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { light, toggle } = useLightMode();

  const handleWalletClick = () => {
    if (connected) disconnect();
    else setVisible(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-black rounded-b-3xl px-6 py-3 flex items-center gap-6 border-x border-b border-white/10 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/40">
              <img src={LOGO_RAW} alt="CNC DAO" className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-white text-lg tracking-wider">CNC DAO</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {[
              { label: 'Mission', href: '/#mission' },
              { label: 'Impact', href: '/impact-map' },
              { label: 'Submit Tree', href: '/#submit' },
              { label: 'KYC', href: '/kyc' },
              { label: 'Governance', href: '/#governance' },
            ].map((item) => (
              <Link key={item.label} href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-gold/40 hover:text-gold transition-all"
              title={light ? 'Dark mode' : 'Light mode'}
            >
              {light ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            <button onClick={handleWalletClick}
              className="flex items-center gap-2 bg-gold text-black pl-5 pr-2 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all group"
            >
              {connected && publicKey ? shortAddress(publicKey.toBase58()) : 'Connect Wallet'}
              <span className="bg-black rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                {connected ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
            </button>
          </div>

          <button className="md:hidden text-white/60 hover:text-gold transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
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

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {[
            { label: 'Mission', href: '/#mission' },
            { label: 'Impact Map', href: '/impact-map' },
            { label: 'Submit Tree', href: '/#submit' },
            { label: 'KYC Verify', href: '/kyc' },
            { label: 'Governance', href: '/#governance' },
          ].map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
              className="font-display text-4xl text-white/70 hover:text-gold transition-colors tracking-widest">
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-4">
            <button onClick={toggle}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-gold transition-colors">
              {light ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button onClick={() => { handleWalletClick(); setMenuOpen(false); }}
              className="bg-gold text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest">
              {connected && publicKey ? shortAddress(publicKey.toBase58()) : 'Connect Wallet'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
