"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { TreePine, Globe, Shield, Sparkles } from "lucide-react";

const IMG_MIDJ = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/Midjourney.jpg";

const TIERS = [
  { id:"seedling", name:"Seedling", tier:"Common",   color:"#4ade80", price:"0.1 SOL", supply:10000, minted:3241, icon:TreePine, desc:"A newly planted tree. Entry-level Nature Hero NFT." },
  { id:"grove",    name:"Grove",    tier:"Rare",     color:"#FFD700", price:"0.5 SOL", supply:2500,  minted:841,  icon:Globe,    desc:"10 verified trees. Enhanced governance & 3× rewards." },
  { id:"forest",   name:"Forest Guardian", tier:"Legendary", color:"#f97316", price:"2 SOL", supply:500, minted:112, icon:Shield, desc:"100 verified trees. Maximum rewards & DAO leadership." },
];

export default function NFTSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // Parallax for background image
  const imgY = useTransform(scrollYProgress, [0,1], ["-8%","8%"]);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-100px" });

  return (
    <section id="nft" ref={sectionRef} className="relative overflow-hidden" style={{ background:"var(--bg)" }}>

      {/* ── Midjourney image — parallax, high opacity, right half ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <img
            src={IMG_MIDJ}
            alt=""
            className="absolute right-0 top-0 h-full w-[60%] object-cover"
            style={{ opacity: 0.28, mixBlendMode: "luminosity" }}
          />
        </motion.div>
        {/* Fade left edge so text stays readable */}
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right, var(--bg) 35%, transparent 70%, var(--bg) 100%)" }} />
        {/* Top/bottom fade */}
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, var(--bg) 0%, transparent 15%, transparent 85%, var(--bg) 100%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 py-24 px-6 md:px-10 max-w-7xl mx-auto">

        {/* ── Header — Phenomenon style: giant left-aligned type ── */}
        <div className="mb-20">
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="flex items-center gap-2 mb-6">
            <Sparkles size={11} className="text-gold" />
            <span className="text-gold text-[9px] font-black uppercase tracking-[0.4em]">On-Chain Collectibles</span>
          </motion.div>

          {/* Words reveal one by one like Phenomenon */}
          <div className="overflow-hidden mb-4">
            <motion.h2
              className="font-display leading-none th-text"
              style={{ fontSize:"clamp(3.5rem,10vw,9rem)" }}
              initial={{ y:"100%" }} whileInView={{ y:0 }}
              viewport={{ once:true }} transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}>
              MINT A TREE.
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              className="font-display leading-none"
              style={{ fontSize:"clamp(3.5rem,10vw,9rem)", color:"var(--gold)" }}
              initial={{ y:"100%" }} whileInView={{ y:0 }}
              viewport={{ once:true }} transition={{ duration:0.9, delay:0.12, ease:[0.16,1,0.3,1] }}>
              OWN THE PLANET.
            </motion.h2>
          </div>

          <motion.p initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.8, delay:0.4 }}
            className="mt-8 text-sm max-w-sm leading-relaxed font-medium th-dim">
            Every NFT is backed by a real verified tree on Solana. Mint yours, watch it grow, earn CNC rewards.
          </motion.p>
        </div>

        {/* ── Tier cards — horizontal, Phenomenon-style minimal cards ── */}
        <div ref={inViewRef} className="grid lg:grid-cols-3 gap-px mb-20" style={{ border:"1px solid var(--border)", borderRadius:"1.5rem", overflow:"hidden" }}>
          {TIERS.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity:0, y:40 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.8, delay:i*0.15, ease:[0.22,1,0.36,1] }}
              className="group relative p-8 transition-all duration-500"
              style={{ background:"var(--bg-card)", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-card)")}
            >
              {/* Tier label */}
              <div className="flex items-center justify-between mb-10">
                <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color:t.color }}>
                  {t.tier}
                </span>
                <motion.div
                  animate={{ rotate:[0,5,-5,0] }}
                  transition={{ duration:4+i, repeat:Infinity, ease:"easeInOut" }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background:`${t.color}15`, border:`1px solid ${t.color}30` }}>
                  <t.icon size={18} style={{ color:t.color }} />
                </motion.div>
              </div>

              {/* Name — large display */}
              <h3 className="font-display mb-3 leading-none th-text" style={{ fontSize:"clamp(2rem,4vw,3.5rem)" }}>{t.name}</h3>
              <p className="text-xs leading-relaxed mb-8 th-faint">{t.desc}</p>

              {/* Supply bar */}
              <div className="mb-8">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                  <span className="th-ghost">Minted</span>
                  <span style={{ color:t.color }}>{t.minted.toLocaleString()} / {t.supply.toLocaleString()}</span>
                </div>
                <div className="h-px" style={{ background:"var(--border)" }}>
                  <motion.div className="h-full" style={{ background:t.color }}
                    initial={{ width:0 }} whileInView={{ width:`${(t.minted/t.supply)*100}%` }}
                    viewport={{ once:true }} transition={{ duration:1.5, delay:0.5+i*0.2, ease:"easeOut" }} />
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest th-ghost mb-1">Price</p>
                  <p className="font-display text-3xl" style={{ color:t.color }}>{t.price}</p>
                </div>
                <Link href={`/nft#${t.id}`}
                  className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all th-ghost group-hover:text-gold">
                  Mint
                  <motion.span animate={{ x:[0,3,0] }} transition={{ duration:1.5, repeat:Infinity }}>→</motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA row ── */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          transition={{ delay:0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8"
          style={{ borderTop:"1px solid var(--border)" }}>
          <div className="flex gap-10">
            {[{ label:"Total NFTs", val:"13,000" }, { label:"Floor", val:"0.1 SOL" }, { label:"Trees Verified", val:"4,194" }].map(s => (
              <div key={s.label}>
                <p className="font-display text-2xl md:text-3xl text-gold">{s.val}</p>
                <p className="text-[9px] uppercase tracking-widest th-ghost">{s.label}</p>
              </div>
            ))}
          </div>
          <Link href="/nft"
            className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all shrink-0"
            style={{ background:"var(--gold)", color:"var(--on-gold)" }}>
            View Full Collection
            <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background:"var(--on-gold)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
