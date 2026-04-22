"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

const LOGO_RAW = "https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg";

// Leaf SVG paths — simple organic shapes
const LEAF_PATHS = [
  "M10,0 C15,5 20,15 10,25 C0,15 5,5 10,0Z",
  "M0,12 C5,0 20,2 18,12 C20,22 5,24 0,12Z",
  "M8,0 C18,4 18,20 8,22 C-2,18 -2,4 8,0Z",
  "M12,0 C20,8 16,20 8,22 C0,20 -4,8 4,2 C6,0 10,-1 12,0Z",
];

interface Leaf {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  speed: number;
  drift: number;
  path: string;
  delay: number;
}

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let leaves: Leaf[] = [];
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn a leaf
    const spawnLeaf = (id: number, immediate = false): Leaf => ({
      id,
      x: Math.random() * w,
      y: immediate ? Math.random() * h : -30,
      size: 8 + Math.random() * 14,
      opacity: 0.12 + Math.random() * 0.18,
      rotation: Math.random() * 360,
      speed: 0.3 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.4,
      path: LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)],
      delay: immediate ? 0 : Math.random() * 3000,
    });

    // Initial leaves
    for (let i = 0; i < 18; i++) leaves.push(spawnLeaf(i, true));

    let lastSpawn = 0;
    let frame = 0;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, w, h);

      // Spawn new leaf every ~2s
      if (timestamp - lastSpawn > 2000) {
        leaves.push(spawnLeaf(Date.now()));
        lastSpawn = timestamp;
      }

      leaves = leaves.filter(leaf => leaf.y < h + 40);

      leaves.forEach(leaf => {
        if (timestamp < leaf.delay) return;

        leaf.y += leaf.speed;
        leaf.x += leaf.drift + Math.sin((leaf.y + frame) * 0.015) * 0.3;
        leaf.rotation += 0.3;

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate((leaf.rotation * Math.PI) / 180);
        ctx.scale(leaf.size / 20, leaf.size / 20);

        const path = new Path2D(leaf.path);
        ctx.fillStyle = `rgba(255, 215, 0, ${leaf.opacity})`;
        ctx.fill(path);
        ctx.restore();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Leaf canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Dot grid bg */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "radial-gradient(#FFD700 0.5px, transparent 0.5px)", backgroundSize: "28px 28px" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* Top — big brand statement */}
        <div className="py-16 md:py-20 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/30">
                  <img src={LOGO_RAW} alt="CNC DAO" className="w-full h-full object-cover" />
                </div>
                <span className="font-display text-2xl text-white tracking-wider">CNC DAO</span>
              </div>
              <h2 className="font-display text-5xl md:text-7xl text-white leading-none">
                PLANT.<br />
                <span className="text-gold gold-text-glow">VERIFY.</span><br />
                EARN.
              </h2>
            </div>
            <div className="flex flex-col gap-4 md:items-end md:pb-2">
              <p className="text-white/30 text-sm max-w-xs leading-relaxed md:text-right">
                Rewarding real-world environmental action with on-chain transparency. Built on Solana.
              </p>
              <Link
                href="/kyc"
                className="self-start md:self-auto group inline-flex items-center gap-3 bg-gold text-black pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
              >
                Get Verified
                <span className="bg-black rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Middle — links grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/5">
          {[
            {
              heading: "Protocol",
              links: [
                { label: "Tree Registry", href: "/#ecosystem" },
                { label: "NFT Identity", href: "/#ecosystem" },
                { label: "Impact Map", href: "/impact-map" },
                { label: "Submit Tree", href: "/#submit" },
              ],
            },
            {
              heading: "Community",
              links: [
                { label: "Nature Heroes", href: "/kyc" },
                { label: "KYC Verification", href: "/kyc" },
                { label: "Governance", href: "/#governance" },
                { label: "Mission", href: "/#mission" },
              ],
            },
            {
              heading: "Technology",
              links: [
                { label: "Solana Blockchain", href: "#" },
                { label: "IPFS Storage", href: "#" },
                { label: "ZK-Privacy", href: "#" },
                { label: "Oracle Network", href: "#" },
              ],
            },
            {
              heading: "Connect",
              links: [
                { label: "Twitter / X", href: "#" },
                { label: "Discord", href: "#" },
                { label: "Telegram", href: "#" },
                { label: "GitHub", href: "https://github.com/cncdaodas-gif/CNC-DAO" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 text-xs font-medium hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/15 text-[9px] font-black uppercase tracking-[0.4em]">
            © 2026 CNC DAO — Transparent Climate Action
          </p>
          <div className="flex items-center gap-6 text-white/15 text-[9px] font-black uppercase tracking-widest">
            <span>Built on Solana</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span>Powered by IPFS</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-gold/50">Mainnet Live</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
