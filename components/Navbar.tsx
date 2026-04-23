"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Sun, Moon } from 'lucide-react';

const LOGO = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg";

function short(addr: string) { return `${addr.slice(0,4)}...${addr.slice(-4)}`; }

export function useLightMode() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('cnc_theme');
    const isLight = stored === 'light';
    setLight(isLight);
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  }, []);
  const toggle = () => {
    const next = !light;
    setLight(next);
    localStorage.setItem('cnc_theme', next ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', next ? 'light' : 'dark');
  };
  return { light, toggle };
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { light, toggle } = useLightMode();

  const onWallet = () => { if (connected) disconnect(); else setVisible(true); };

  const NAV = [
    { label:'Mission',     href:'/#mission' },
    { label:'Impact',      href:'/impact-map' },
    { label:'Submit Tree', href:'/#submit' },
    { label:'KYC',         href:'/kyc' },
    { label:'Governance',  href:'/#governance' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        {/* Navbar always dark regardless of page theme */}
        <nav className="pointer-events-auto rounded-b-3xl px-5 py-2.5 flex items-center gap-5 border-x border-b border-white/10 backdrop-blur-xl"
          style={{ background: 'var(--nav-bg)' }}>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-yellow-500/40">
              <img src={LOGO} alt="CNC DAO" className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-white text-lg tracking-wider">CNC DAO</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV.map(item => (
              <Link key={item.label} href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.18em] transition-colors whitespace-nowrap"
                style={{ color: 'var(--nav-text)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--nav-text)')}
              >{item.label}</Link>
            ))}
          </div>

          {/* Theme toggle + wallet */}
          <div className="hidden md:flex items-center gap-2">
            {/* Sun/Moon right next to Connect Wallet */}
            <button onClick={toggle}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all border border-white/15 text-white/50 hover:border-yellow-500/40 hover:text-yellow-400"
              title={light ? 'Dark mode' : 'Light mode'}
            >
              {light ? <Moon size={13} /> : <Sun size={13} />}
            </button>

            <button onClick={onWallet}
              className="flex items-center gap-2 bg-gold text-black pl-5 pr-1.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all group"
            >
              {connected && publicKey ? short(publicKey.toBase58()) : 'Connect Wallet'}
              <span className="bg-black rounded-full w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                {connected
                  ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 2.5l6 6M8.5 2.5l-6 6" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                }
              </span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white/60 hover:text-yellow-400 transition-colors ml-auto" onClick={() => setOpen(!open)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open
                ? <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                : <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              }
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 backdrop-blur-xl flex flex-col items-center justify-center gap-7"
          style={{ background: 'rgba(10,8,4,0.97)' }}>
          {NAV.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
              className="font-display text-4xl tracking-widest transition-colors"
              style={{ color: 'rgba(255,255,255,0.70)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
            >{item.label}</Link>
          ))}
          <div className="flex items-center gap-3 mt-4">
            <button onClick={toggle}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-yellow-400 transition-colors">
              {light ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button onClick={() => { onWallet(); setOpen(false); }}
              className="bg-gold text-black px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest">
              {connected && publicKey ? short(publicKey.toBase58()) : 'Connect Wallet'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
