"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Transaction, TransactionInstruction, PublicKey } from "@solana/web3.js";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  TreePine, Globe, Shield, Sparkles, CheckCircle,
  Loader2, ArrowLeft, Zap, Lock, Users, Star
} from "lucide-react";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

const NFT_TIERS = [
  {
    id: "seedling",
    name: "Seedling",
    tier: "Common",
    tierColor: "#4ade80",
    glow: "rgba(74,222,128,0.2)",
    description: "A newly planted tree, full of potential. Your entry into the CNC DAO ecosystem.",
    longDesc: "The Seedling NFT represents a single verified tree on the Solana blockchain. Each Seedling is backed by a real tree planted and verified by 2 Nature Heroes. Holding a Seedling grants you basic governance rights and access to the CNC DAO community.",
    price: "0.1 SOL",
    priceNum: 0.1,
    supply: 10000,
    minted: 3241,
    icon: TreePine,
    gradient: "from-green-950 via-green-900/30 to-black",
    perks: ["1 Verified Tree on-chain", "Basic governance voting", "Community access", "CNC token rewards"],
  },
  {
    id: "grove",
    name: "Grove",
    tier: "Rare",
    tierColor: "#FFD700",
    glow: "rgba(255,215,0,0.25)",
    description: "A thriving grove of 10 verified trees. Enhanced governance and higher rewards.",
    longDesc: "The Grove NFT bundles 10 verified trees into a single on-chain identity. Grove holders receive 3x the CNC token rewards of Seedling holders and enhanced governance voting power. Perfect for serious climate advocates.",
    price: "0.5 SOL",
    priceNum: 0.5,
    supply: 2500,
    minted: 841,
    icon: Globe,
    gradient: "from-yellow-950 via-yellow-900/30 to-black",
    perks: ["10 Verified Trees on-chain", "3x CNC token rewards", "Enhanced governance", "Priority validation queue", "Exclusive Grove Discord"],
  },
  {
    id: "forest",
    name: "Forest Guardian",
    tier: "Legendary",
    tierColor: "#f97316",
    glow: "rgba(249,115,22,0.25)",
    description: "Guardian of 100 verified trees. Maximum rewards and exclusive DAO leadership.",
    longDesc: "The Forest Guardian is the pinnacle of the CNC DAO NFT collection. Representing 100 verified trees, Forest Guardians are DAO leaders with maximum governance power, 10x rewards, and the ability to propose new conservation projects.",
    price: "2 SOL",
    priceNum: 2,
    supply: 500,
    minted: 112,
    icon: Shield,
    gradient: "from-orange-950 via-orange-900/30 to-black",
    perks: ["100 Verified Trees on-chain", "10x CNC token rewards", "DAO proposal rights", "Direct oracle access", "Carbon credit certificates", "Physical certificate + merch"],
  },
];

type MintStep = "idle" | "confirming" | "minting" | "success" | "error";

export default function NFTPage() {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [selected, setSelected] = useState<typeof NFT_TIERS[0] | null>(null);
  const [mintStep, setMintStep] = useState<MintStep>("idle");
  const [txSig, setTxSig] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [quantity, setQuantity] = useState(1);

  const openMint = (nft: typeof NFT_TIERS[0]) => {
    if (!connected) { setVisible(true); return; }
    setSelected(nft);
    setMintStep("idle");
    setQuantity(1);
  };

  const handleMint = async () => {
    if (!connected || !publicKey || !selected) return;
    try {
      setMintStep("confirming");

      const mintData = JSON.stringify({
        protocol:  "CNC_DAO_v1",
        type:      "NFT_MINT",
        tier:      selected.id,
        quantity,
        price:     selected.priceNum * quantity,
        owner:     publicKey.toBase58(),
        timestamp: new Date().toISOString(),
      });

      const tx = new Transaction().add(
        new TransactionInstruction({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(mintData, "utf-8"),
        })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection);
      setMintStep("minting");
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
      setTxSig(sig);
      setMintStep("success");
    } catch (err: any) {
      setErrMsg(err?.message?.includes("rejected") ? "Transaction cancelled." : err?.message || "Mint failed.");
      setMintStep("error");
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 px-6 max-w-7xl mx-auto">
        <Link href="/"
          className="inline-flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-widest th-ghost hover:text-gold transition-colors group">
          <span className="w-8 h-8 rounded-full flex items-center justify-center border transition-all group-hover:border-gold/40"
            style={{ borderColor: "var(--border)" }}>
            <ArrowLeft size={13} />
          </span>
          Back to Home
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={12} className="text-gold" />
          <span className="text-gold text-[9px] font-black uppercase tracking-[0.35em]">On-Chain Collectibles</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-none th-text">
            CNC DAO<br /><span className="text-gold gold-text-glow">NFT TREES.</span>
          </h1>
          <p className="text-sm max-w-sm leading-relaxed lg:pb-4 font-medium lg:text-right th-dim">
            Each NFT is backed by a real tree planted, photographed, GPS-verified, and anchored on Solana. Mint a tree. Own a piece of the planet.
          </p>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-4 gap-3 mb-20">
          {[
            { icon: TreePine, step: "01", title: "Choose a Tier",    desc: "Seedling, Grove, or Forest Guardian." },
            { icon: Zap,      step: "02", title: "Connect & Mint",   desc: "Pay in SOL. Transaction anchored on-chain." },
            { icon: CheckCircle, step: "03", title: "Get Verified",  desc: "2 Nature Heroes verify your tree(s)." },
            { icon: Star,     step: "04", title: "Earn Rewards",     desc: "Receive CNC tokens. Vote. Grow." },
          ].map((item, i) => (
            <motion.div key={item.step}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl p-6 th-card" style={{ border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gold"
                  style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-border)" }}>
                  <item.icon size={14} />
                </div>
                <span className="font-display text-2xl" style={{ color: "var(--border)" }}>{item.step}</span>
              </div>
              <h3 className="font-black uppercase text-xs mb-1 th-text">{item.title}</h3>
              <p className="text-[10px] leading-relaxed th-faint">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* NFT Tiers */}
        <div className="space-y-4">
          {NFT_TIERS.map((nft, i) => (
            <motion.div key={nft.id} id={nft.id}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="grid lg:grid-cols-2">

                {/* Visual panel */}
                <div className={`relative bg-gradient-to-br ${nft.gradient} min-h-[280px] flex items-center justify-center overflow-hidden p-10`}>
                  {/* Animated rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[1,2,3,4].map(ring => (
                      <motion.div key={ring}
                        className="absolute rounded-full border"
                        style={{ borderColor: nft.tierColor, opacity: 0.1 }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.03, 0.1] }}
                        transition={{ duration: 3 + ring, repeat: Infinity, delay: ring * 0.6 }}
                        initial={{ width: `${80 + ring * 50}px`, height: `${80 + ring * 50}px` }}
                      />
                    ))}
                  </div>

                  {/* Floating icon */}
                  <motion.div
                    animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center"
                    style={{ background: nft.glow, border: `2px solid ${nft.tierColor}50`, boxShadow: `0 0 50px ${nft.glow}` }}
                  >
                    <nft.icon size={52} style={{ color: nft.tierColor }} />
                  </motion.div>

                  {/* Sparkle dots */}
                  {[...Array(8)].map((_, j) => (
                    <motion.div key={j}
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{ background: nft.tierColor, top: `${15 + (j * 10)}%`, left: `${5 + (j * 12)}%` }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                      transition={{ duration: 1.5 + j * 0.3, repeat: Infinity, delay: j * 0.4 }}
                    />
                  ))}

                  {/* Tier badge */}
                  <div className="absolute top-5 left-5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                    style={{ background: `${nft.tierColor}20`, border: `1px solid ${nft.tierColor}40`, color: nft.tierColor }}>
                    {nft.tier}
                  </div>
                </div>

                {/* Info panel */}
                <div className="p-8 md:p-10 flex flex-col justify-between th-card">
                  <div>
                    <h2 className="font-display text-4xl mb-2 th-text">{nft.name}</h2>
                    <p className="text-sm leading-relaxed mb-6 th-dim">{nft.longDesc}</p>

                    {/* Perks */}
                    <div className="space-y-2 mb-8">
                      {nft.perks.map(perk => (
                        <div key={perk} className="flex items-center gap-2">
                          <CheckCircle size={12} style={{ color: nft.tierColor, flexShrink: 0 }} />
                          <span className="text-xs font-medium th-sec">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Supply progress */}
                    <div className="mb-5">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                        <span className="th-ghost">Supply</span>
                        <span style={{ color: nft.tierColor }}>{nft.minted.toLocaleString()} / {nft.supply.toLocaleString()} minted</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: nft.tierColor }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(nft.minted / nft.supply) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Price + Mint */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest th-ghost mb-0.5">Price per NFT</p>
                        <p className="font-display text-3xl" style={{ color: nft.tierColor }}>{nft.price}</p>
                      </div>
                      <button onClick={() => openMint(nft)}
                        className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
                        style={{ background: nft.tierColor === "#FFD700" ? "var(--gold)" : nft.tierColor, color: nft.tierColor === "#FFD700" ? "var(--on-gold)" : "#000" }}>
                        {connected ? "Mint Now" : "Connect & Mint"}
                        <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: "rgba(0,0,0,0.25)" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-20">
          <h2 className="font-display text-4xl mb-8 th-text">FAQs</h2>
          <div className="space-y-3">
            {[
              { q: "Is the tree real?", a: "Yes. Every CNC DAO NFT is backed by a real tree that has been physically planted, photographed, GPS-verified, and approved by 2 independent Nature Heroes before the NFT is eligible to mint." },
              { q: "What wallet do I need?", a: "Any Solana wallet works — Phantom and Solflare are recommended. You'll need enough SOL to cover the mint price plus a small transaction fee (< 0.001 SOL)." },
              { q: "What are CNC tokens?", a: "CNC is the governance and rewards token of CNC DAO. NFT holders earn CNC passively based on their tier. Tokens can be used to vote on proposals, fund new projects, or traded on Solana DEXs." },
              { q: "Can I transfer or sell my NFT?", a: "Yes. All CNC DAO NFTs are standard Solana NFTs (Metaplex standard) and can be transferred, listed, or traded on any Solana NFT marketplace like Tensor or Magic Eden." },
              { q: "What happens after I mint?", a: "Your NFT goes into a verification queue. 2 Nature Heroes will review and approve the underlying tree submission. Once approved, your NFT becomes fully active and rewards begin accruing." },
            ].map((faq, i) => (
              <motion.details key={i}
                className="rounded-2xl overflow-hidden group th-card"
                style={{ border: "1px solid var(--border)" }}>
                <summary className="p-5 cursor-pointer font-black text-sm uppercase tracking-tight list-none flex items-center justify-between th-text">
                  {faq.q}
                  <span className="text-gold text-lg font-light group-open:rotate-45 transition-transform inline-block">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed th-dim">{faq.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── MINT MODAL ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
            onClick={e => { if (e.target === e.currentTarget && mintStep === "idle") setSelected(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <AnimatePresence mode="wait">

                {/* ── Idle: quantity + confirm ── */}
                {mintStep === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Modal header visual */}
                    <div className={`relative bg-gradient-to-b ${selected.gradient} h-40 flex items-center justify-center`}>
                      <motion.div animate={{ y: [-4,4,-4] }} transition={{ duration: 3, repeat: Infinity }}
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ background: selected.glow, border: `2px solid ${selected.tierColor}50`, boxShadow: `0 0 30px ${selected.glow}` }}>
                        <selected.icon size={36} style={{ color: selected.tierColor }} />
                      </motion.div>
                      <button onClick={() => setSelected(null)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                        style={{ background: "rgba(0,0,0,0.4)" }}>
                        ✕
                      </button>
                    </div>

                    <div className="p-6">
                      <h3 className="font-display text-3xl mb-1 th-text">{selected.name}</h3>
                      <p className="text-xs mb-5 th-faint">{selected.tier} · {selected.price} per NFT</p>

                      {/* Quantity */}
                      <div className="mb-5">
                        <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-3 block th-faint">Quantity</label>
                        <div className="flex items-center gap-4">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-full font-black text-lg transition-all th-card th-text"
                            style={{ border: "1px solid var(--border)" }}>−</button>
                          <span className="font-display text-3xl th-text w-8 text-center">{quantity}</span>
                          <button onClick={() => setQuantity(Math.min(10, quantity + 1))}
                            className="w-10 h-10 rounded-full font-black text-lg transition-all th-card th-text"
                            style={{ border: "1px solid var(--border)" }}>+</button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between p-4 rounded-xl mb-5"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                        <span className="text-[10px] font-black uppercase tracking-widest th-ghost">Total Cost</span>
                        <span className="font-display text-2xl" style={{ color: selected.tierColor }}>
                          {(selected.priceNum * quantity).toFixed(2)} SOL
                        </span>
                      </div>

                      {/* Wallet address */}
                      {publicKey && (
                        <div className="flex items-center gap-2 p-3 rounded-xl mb-5"
                          style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
                          <CheckCircle size={12} className="text-green-400 shrink-0" />
                          <span className="text-[10px] font-mono th-dim truncate">{publicKey.toBase58()}</span>
                        </div>
                      )}

                      <button onClick={handleMint}
                        className="w-full group flex items-center justify-between pl-7 pr-2 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:gap-2"
                        style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
                        Confirm Mint · {(selected.priceNum * quantity).toFixed(2)} SOL
                        <span className="rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: "var(--on-gold)" }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M7 2l5 5-5 5" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Confirming ── */}
                {mintStep === "confirming" && (
                  <motion.div key="confirming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 px-8 gap-5 text-center">
                    <Loader2 size={40} className="text-gold animate-spin" />
                    <div>
                      <p className="font-display text-3xl mb-2 th-text">APPROVE IN WALLET</p>
                      <p className="text-xs uppercase tracking-widest th-faint">Check Phantom or Solflare to approve the transaction.</p>
                    </div>
                  </motion.div>
                )}

                {/* ── Minting ── */}
                {mintStep === "minting" && (
                  <motion.div key="minting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 px-8 gap-5 text-center">
                    <Loader2 size={40} className="text-gold animate-spin" />
                    <div>
                      <p className="font-display text-3xl mb-2 th-text">MINTING…</p>
                      <p className="text-xs uppercase tracking-widest th-faint">Confirming on Solana. This takes a few seconds.</p>
                    </div>
                  </motion.div>
                )}

                {/* ── Success ── */}
                {mintStep === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 px-8 gap-5 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: "var(--gold-dim)", border: "2px solid var(--gold)" }}>
                      <CheckCircle size={40} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-display text-4xl mb-2 th-text">MINTED! 🌳</p>
                      <p className="text-sm max-w-xs leading-relaxed th-dim">
                        Your {selected?.name} NFT{quantity > 1 ? "s are" : " is"} on-chain. Pending Nature Hero verification — rewards begin once approved.
                      </p>
                    </div>
                    <a href={`https://solscan.io/tx/${txSig}`} target="_blank" rel="noopener noreferrer"
                      className="text-gold text-[10px] font-black uppercase tracking-widest hover:underline">
                      View on Solscan →
                    </a>
                    <button onClick={() => setSelected(null)}
                      className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all th-dim hover:text-gold"
                      style={{ border: "1px solid var(--border)" }}>
                      Close
                    </button>
                  </motion.div>
                )}

                {/* ── Error ── */}
                {mintStep === "error" && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 px-8 gap-5 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                      <span className="text-red-400 text-2xl">✕</span>
                    </div>
                    <div>
                      <p className="font-display text-3xl mb-2 th-text">MINT FAILED</p>
                      <p className="text-sm th-dim">{errMsg}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setMintStep("idle")}
                        className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                        style={{ background: "var(--gold)", color: "var(--on-gold)" }}>
                        Try Again
                      </button>
                      <button onClick={() => setSelected(null)}
                        className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest th-dim hover:text-gold transition-all"
                        style={{ border: "1px solid var(--border)" }}>
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
