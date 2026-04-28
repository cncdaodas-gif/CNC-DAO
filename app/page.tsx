"use client";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import KYC from '@/components/KYC';
import ImpactMap from '@/components/ImpactMap';
import NFTSection from '@/components/NFTSection';
import TreeSubmissionForm from '@/components/TreeSubmissionForm';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// All images — raw GitHub URLs
const IMG_LEAVES = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/leaves%20at%20sunset.JPG";
const IMG_PALM   = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/palm.jpg";
const IMG_STRAY  = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/main/assets/Stray%20Game%20Background%20Hd.jpg";

function StrayBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0,1], ["-10%","10%"]);
  const scale = useTransform(scrollYProgress, [0,0.5,1], [1.12,1.06,1.12]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.img src={IMG_STRAY} alt="" className="absolute inset-0 w-full h-full object-cover"
        style={{ y, scale, opacity:0.45, mixBlendMode:"luminosity" as any }} />
      {/* Rain canvas effect via CSS animation */}
      <div className="absolute inset-0" style={{
        background:"linear-gradient(to bottom, var(--bg) 0%, transparent 20%, transparent 80%, var(--bg) 100%)",
      }} />
      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse 60% 60% at 50% 50%, var(--bg) 10%, transparent 70%)",
      }} />
      {/* Animated gold shimmer sweep */}
      <motion.div className="absolute inset-0"
        style={{ background:"linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.04) 50%, transparent 70%)" }}
        animate={{ x:["-100%","100%"] }} transition={{ duration:8, repeat:Infinity, ease:"linear", repeatDelay:4 }} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ background:'var(--bg)' }}>
      <Navbar />
      <Hero />
      <KYC />
      <ImpactMap />

      {/* NFT section — Midjourney image handled inside NFTSection */}
      <NFTSection />

      {/* Submit Tree — leaves at sunset + particle network */}
      <div className="relative" style={{ background:'var(--bg)' }}>
        {/* Leaves at sunset — visible on right side */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img src={IMG_LEAVES} alt="" className="absolute right-0 top-0 h-full w-[50%] object-cover"
            style={{ opacity:0.18, mixBlendMode:"luminosity" }} />
          <div className="absolute inset-0" style={{ background:"linear-gradient(to right, var(--bg) 40%, transparent 75%, var(--bg) 100%)" }} />
          <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, var(--bg) 0%, transparent 15%, transparent 85%, var(--bg) 100%)" }} />
        </div>
        <TreeSubmissionForm />
      </div>

      {/* Ecosystem — palm.jpg right side, very visible */}
      <section id="ecosystem" className="relative overflow-hidden py-24 border-t" style={{ background:'var(--bg)', borderColor:'var(--border-sm)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img src={IMG_PALM} alt="" className="absolute right-0 top-0 h-full w-[55%] object-cover"
            style={{ opacity:0.55 }} />
          <div className="absolute inset-0" style={{ background:"linear-gradient(to right, var(--bg) 0%, var(--bg) 35%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, var(--bg) 0%, transparent 10%, transparent 90%, var(--bg) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="overflow-hidden mb-2">
            <motion.p initial={{ y:"100%" }} whileInView={{ y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7 }} className="text-gold text-[9px] font-black uppercase tracking-[0.35em]">
              Built on Solana
            </motion.p>
          </div>
          <div className="overflow-hidden mb-16">
            <motion.h2 initial={{ y:"100%" }} whileInView={{ y:0 }} viewport={{ once:true }}
              transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
              className="font-display leading-none th-text" style={{ fontSize:"clamp(3rem,9vw,8rem)" }}>
              THE <span className="text-gold gold-text-glow">ECOSYSTEM</span>
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3 lg:w-[58%]">
            {[
              { num:'01', title:'Tree Registry',  desc:'Every planted tree anchored permanently on Solana with GPS + timestamp.' },
              { num:'02', title:'NFT Identity',   desc:'1 Verified Tree = 1 Digital Identity. Each tree minted as a unique NFT.' },
              { num:'03', title:'Nature Heroes',  desc:'2 independent validators must approve each tree submission.' },
              { num:'04', title:'Impact Map',     desc:'Global map of all planting activity and verification status.' },
            ].map((item, i) => (
              <motion.div key={item.num}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.1 }}
                className="group rounded-2xl p-7 transition-all hover:border-gold/30"
                style={{ background:'rgba(0,0,0,0.65)', border:'1px solid var(--border)', backdropFilter:'blur(20px)' }}>
                <div className="font-display text-5xl text-gold/15 group-hover:text-gold/30 transition-colors mb-6">{item.num}</div>
                <h3 className="font-black uppercase tracking-tight text-sm mb-3 th-text">{item.title}</h3>
                <p className="text-xs leading-relaxed th-faint">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Movement — Stray Game Background with parallax + shimmer */}
      <section id="governance" className="relative overflow-hidden border-t" style={{ minHeight:'620px', borderColor:'var(--border-sm)' }}>
        <StrayBackground />
        <div className="relative z-10 py-28 max-w-4xl mx-auto px-6 text-center">
          <div className="overflow-hidden mb-2">
            <motion.p initial={{ y:"100%" }} whileInView={{ y:0 }} viewport={{ once:true }}
              className="text-gold text-[9px] font-black uppercase tracking-[0.35em]">
              Join the Movement
            </motion.p>
          </div>
          {["PLANT.", "VERIFY.", "EARN."].map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.div initial={{ y:"100%" }} whileInView={{ y:0 }} viewport={{ once:true }}
                transition={{ duration:0.9, delay:i*0.12, ease:[0.16,1,0.3,1] }}
                className={`font-display leading-none ${i===1?"text-gold gold-text-glow":"th-text"}`}
                style={{ fontSize:"clamp(4rem,12vw,10rem)" }}>
                {word}
              </motion.div>
            </div>
          ))}
          <motion.p initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.6 }}
            className="text-sm leading-relaxed max-w-lg mx-auto mt-8 mb-12 font-semibold"
            style={{ color:"rgba(255,255,255,0.75)" }}>
            Become a Nature Hero. Validate tree submissions, earn CNC tokens, and build a transparent climate-action economy on Solana.
          </motion.p>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.7 }} className="flex flex-wrap gap-4 justify-center">
            <Link href="/kyc"
              className="group inline-flex items-center gap-3 pl-7 pr-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
              style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
              Start KYC Verification
              <span className="rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background:'var(--on-gold)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>
            <Link href="/#submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:text-gold backdrop-blur-sm"
              style={{ border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.7)' }}>
              Submit a Tree
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
