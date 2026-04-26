"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  src: string;
  alt?: string;
  /** Which animation style to apply */
  variant: "kenburns" | "parallax" | "breathe";
  /** Opacity of the image 0-1 */
  opacity?: number;
  /** Extra className on wrapper */
  className?: string;
  /** Children rendered on top */
  children?: React.ReactNode;
}

export default function AnimatedImage({ src, alt = "", variant, opacity = 0.35, className = "", children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Parallax — image moves slower than scroll, creating depth
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  // Subtle scale for parallax
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.04, 1.08]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* ── Ken Burns: slow zoom + drift ── */}
      {variant === "kenburns" && (
        <motion.div
          className="absolute inset-0"
          animate={{
            scale:   [1, 1.08, 1.04, 1],
            x:       ["0%", "2%", "-1%", "0%"],
            y:       ["0%", "1%", "-2%", "0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover"
            style={{ opacity, mixBlendMode: "luminosity" }} />
        </motion.div>
      )}

      {/* ── Parallax: moves on scroll ── */}
      {variant === "parallax" && (
        <motion.div className="absolute inset-0 scale-110" style={{ y }}>
          <motion.img src={src} alt={alt} className="w-full h-full object-cover"
            style={{ opacity, mixBlendMode: "luminosity", scale }}
          />
        </motion.div>
      )}

      {/* ── Breathe: gentle pulse in and out ── */}
      {variant === "breathe" && (
        <motion.div className="absolute inset-0"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover"
            style={{ opacity, mixBlendMode: "luminosity" }} />
        </motion.div>
      )}

      {/* Light sweep overlay — subtle shimmer across the image */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.06) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--bg) 100%)" }} />

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
