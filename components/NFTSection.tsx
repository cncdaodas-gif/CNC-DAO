"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Sparkles, TreePine, Globe, Shield } from "lucide-react";

// NFT tiers — each represents a real tree planted and verified
const NFT_TIERS = [
  {
    id: "seedling",
    name: "Seedling",
    tier: "Common",
    tierColor: "#4ade80",
    description: "A newly planted tree, full of potential. Entry-level Nature Hero NFT.",
    price: "0.1 SOL",
    supply: "10,000",
    minted: "3,241",
    icon: TreePine,
    gradient: "from-green-900/40 to-black",
    border: "border-green-500/20",
    glow: "rgba(74,222,128,0.15)",
  },
  {
    id: "grove",
    name: "Grove",
    tier: "Rare",
    tierColor: "#FFD700",
    description: "A thriving grove of 10 verified trees. Grants enhanced governance power.",
    price: "0.5 SOL",
    supply: "2,500",
    minted: "841",
    icon: Globe,
    gradient: "from-yellow-900/40 to-black",
    border: "border-yellow-500/30",
    glow: "rgba(255,215,0,0.2)",
  },
  {
    id: "forest",
    name: "Forest Guardian",
    tier: "Legendary",
    tierColor: "#f97316",
    description: "Guardian of 100 verified trees. Maximum rewards and exclusive DAO access.",
    price: "2 SOL",
    supply: "500",
    minted: "112",
    icon: Shield,
    gradient: "from-orange-900/40 to-black",
    border: "border-orange-500/30",
    glow: "rgba(249,115,22,0.2)",
  },
];

export default function NFTSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="nft" className="py-24 border-t relative overflow-hidden"
      style={{ background: "var(--bg-deep)", borderColor: "var(--border-sm)" }}>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#FFD700 0.5px, transparent 0.5px)", backgroundSize: "28px 28px" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={12} className="text-gold" />
              <span className="text-gold text-[9px] font-black uppercase tracking-[0.35em]">On-Chain Collectibles</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none th-text">
              CNC DAO<br /><span className="text-gold gold-text-glow">NFT TREES.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:items-end md:pb-2">
            <p className="text-sm leading-relaxed max-w-xs md:text-right font-medium th-dim">
              Every NFT represents a real verified tree on-chain. Mint yours, watch it grow, earn rewards.
            </p>
            <Link href="/nft"
              className="self-start md:self-auto group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
              style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
              View Full Collection
              <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: "var(--on-gold)" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>

        {/* NFT Cards */}
        <div ref={ref} className="grid md:grid-cols-3 gap-4 mb-12">
          {NFT_TIERS.map((nft, i) => (
            <motion.div key={nft.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/nft#${nft.id}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid var(--border)`,
                  boxShadow: `0 0 0 transparent`,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 20px 60px ${nft.glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 transparent`)}
              >
                {/* NFT Visual */}
                <div className={`relative h-52 bg-gradient-to-b ${nft.gradient} flex items-center justify-center overflow-hidden`}>
                  {/* Animated rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[1, 2, 3].map(ring => (
                      <motion.div key={ring}
                        className="absolute rounded-full border"
                        style={{ borderColor: nft.tierColor, opacity: 0.15 - ring * 0.03 }}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.15 - ring * 0.03, 0.05, 0.15 - ring * 0.03] }}
                        transition={{ duration: 3 + ring, repeat: Infinity, ease: "easeInOut", delay: ring * 0.5 }}
                        initial={{ width: `${60 + ring * 35}px`, height: `${60 + ring * 35}px` }}
                      />
                    ))}
                  </div>

                  {/* Icon */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: `${nft.glow}`, border: `2px solid ${nft.tierColor}40`, boxShadow: `0 0 30px ${nft.glow}` }}
                  >
                    <nft.icon size={36} style={{ color: nft.tierColor }} />
                  </motion.div>

                  {/* Tier badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                    style={{ background: `${nft.tierColor}20`, border: `1px solid ${nft.tierColor}40`, color: nft.tierColor }}>
                    {nft.tier}
                  </div>

                  {/* Particle sparkles */}
                  {[...Array(6)].map((_, j) => (
                    <motion.div key={j}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        background: nft.tierColor,
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                      }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                  ))}
                </div>

                {/* Card info */}
                <div className="p-6">
                  <h3 className="font-display text-2xl mb-1 th-text">{nft.name}</h3>
                  <p className="text-xs leading-relaxed mb-4 th-faint">{nft.description}</p>

                  {/* Supply bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1.5">
                      <span className="th-ghost">Minted</span>
                      <span style={{ color: nft.tierColor }}>{nft.minted} / {nft.supply}</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{
                          background: nft.tierColor,
                          width: `${(parseInt(nft.minted.replace(",","")) / parseInt(nft.supply.replace(",",""))) * 100}%`,
                        }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest th-ghost">Price</p>
                      <p className="font-display text-xl" style={{ color: nft.tierColor }}>{nft.price}</p>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest th-ghost group-hover:text-gold transition-colors flex items-center gap-1">
                      Mint Now
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total NFTs",      value: "13,000" },
            { label: "Total Minted",    value: "4,194" },
            { label: "Floor Price",     value: "0.1 SOL" },
            { label: "Trees Verified",  value: "4,194" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 text-center th-card"
              style={{ border: "1px solid var(--border)" }}>
              <p className="font-display text-2xl text-gold">{s.value}</p>
              <p className="text-[9px] uppercase tracking-widest mt-1 th-ghost">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
