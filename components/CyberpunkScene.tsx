"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  src: string;
  /** How visible the image is */
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export default function CyberpunkScene({ src, opacity = 0.45, className = "", children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init rain drops
    const drops: RainDrop[] = Array.from({ length: 120 }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      speed:   4 + Math.random() * 8,
      length:  12 + Math.random() * 24,
      opacity: 0.08 + Math.random() * 0.18,
    }));

    let frame = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const w = canvas.width;
      const h = canvas.height;
      frame++;

      ctx.clearRect(0, 0, w, h);

      // Draw rain
      for (const drop of drops) {
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.15; // slight diagonal
        if (drop.y > h + drop.length) { drop.y = -drop.length; drop.x = Math.random() * w; }
        if (drop.x < -10) drop.x = w + 10;

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.15, drop.y + drop.length);
        ctx.strokeStyle = `rgba(150, 220, 255, ${drop.opacity})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Occasional horizontal scan line glitch
      if (frame % 180 === 0) {
        const glitchY = Math.random() * h;
        ctx.fillStyle = "rgba(255, 215, 0, 0.04)";
        ctx.fillRect(0, glitchY, w, 1 + Math.random() * 3);
      }

      // Subtle neon flicker at bottom (simulates city glow)
      const flicker = 0.015 + Math.sin(frame * 0.05) * 0.008;
      const grd = ctx.createLinearGradient(0, h * 0.7, 0, h);
      grd.addColorStop(0, "transparent");
      grd.addColorStop(1, `rgba(180, 100, 255, ${flicker})`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, h * 0.7, w, h * 0.3);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>

      {/* Base image — Ken Burns zoom */}
      <motion.div
        className="absolute inset-0 scale-110"
        animate={{ scale: [1.1, 1.16, 1.1], x: ["0%", "1.5%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={src} alt="Cyberpunk cityscape" className="w-full h-full object-cover"
          style={{ opacity, mixBlendMode: "luminosity" }} />
      </motion.div>

      {/* Rain canvas on top */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />

      {/* Horizontal scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        zIndex: 3,
      }} />

      {/* Neon colour grade */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.04) 0%, transparent 50%, rgba(120,80,200,0.06) 100%)", zIndex: 4 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gold light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 25%, rgba(255,215,0,0.05) 50%, transparent 75%)",
          zIndex: 5,
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
      />

      {/* Bottom vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to top, var(--bg) 0%, transparent 40%)",
        zIndex: 6,
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, var(--bg) 100%)",
        zIndex: 6,
      }} />

      {children && <div className="relative" style={{ zIndex: 10 }}>{children}</div>}
    </div>
  );
}
