"use client";
import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulsePhase: number;
  pulseSpeed: number;
}

const MAX_DIST = 140;       // max distance to draw a line
const MOUSE_RADIUS = 180;   // mouse repulsion radius
const PARTICLE_COUNT = 75;
const GOLD = { r: 255, g: 215, b: 0 };

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animId = useRef<number>(0);
  const isHovering = useRef(false);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  const spawn = useCallback((w: number, h: number): Particle => ({
    x:          Math.random() * w,
    y:          Math.random() * h,
    vx:         (Math.random() - 0.5) * 0.4,
    vy:         (Math.random() - 0.5) * 0.4,
    radius:     1.5 + Math.random() * 2,
    opacity:    0.3 + Math.random() * 0.5,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
      spawn(canvas.width, canvas.height)
    );

    // ── Mouse / Touch handlers ──
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      isHovering.current = true;
    };
    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      isHovering.current = false;
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
      isHovering.current = true;
    };
    const onTouchEnd = () => {
      // Fade mouse away slowly rather than snapping
      setTimeout(() => { mouse.current = { x: -9999, y: -9999 }; isHovering.current = false; }, 600);
    };

    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove",  onTouch, { passive: true });
    canvas.addEventListener("touchstart", onTouch, { passive: true });
    canvas.addEventListener("touchend",   onTouchEnd);

    let frame = 0;

    const draw = () => {
      animId.current = requestAnimationFrame(draw);
      const w = canvas.width;
      const h = canvas.height;
      frame++;

      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Update + draw particles
      for (const p of particles.current) {
        // Drift
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;

        // Wrap around edges
        if (p.x < -10)  p.x = w + 10;
        if (p.x > w+10) p.x = -10;
        if (p.y < -10)  p.y = h + 10;
        if (p.y > h+10) p.y = -10;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force  = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle  = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.6;
          p.vy += Math.sin(angle) * force * 0.6;
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) { p.vx = (p.vx / speed) * 2.5; p.vy = (p.vy / speed) * 2.5; }
        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Pulsing opacity
        const pulse = 0.7 + 0.3 * Math.sin(p.pulsePhase);
        const nearMouse = dist < MOUSE_RADIUS * 1.5 ? 1 + (1 - dist / (MOUSE_RADIUS * 1.5)) * 1.2 : 1;
        const alpha = Math.min(1, p.opacity * pulse * nearMouse);

        // Draw dot
        const r = p.radius * (1 + (dist < MOUSE_RADIUS ? (1 - dist / MOUSE_RADIUS) * 1.5 : 0));
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${alpha})`;
        ctx.fill();

        // Glow on dots near mouse
        if (dist < MOUSE_RADIUS * 0.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
          grd.addColorStop(0, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.15)`);
          grd.addColorStop(1, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0)`);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.current.length; i++) {
        const a = particles.current[i];
        for (let j = i + 1; j < particles.current.length; j++) {
          const b = particles.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const lineOpacity = (1 - d / MAX_DIST) * 0.35;

            // Extra brightness if either particle is near mouse
            const aDist = Math.sqrt((a.x-mx)**2 + (a.y-my)**2);
            const bDist = Math.sqrt((b.x-mx)**2 + (b.y-my)**2);
            const boost = Math.min(aDist, bDist) < MOUSE_RADIUS ? 1.8 : 1;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${Math.min(0.7, lineOpacity * boost)})`;
            ctx.lineWidth = boost > 1 ? 1.2 : 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw lines from mouse to nearby particles
      if (isHovering.current) {
        for (const p of particles.current) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_RADIUS * 1.2) {
            const a = (1 - d / (MOUSE_RADIUS * 1.2)) * 0.6;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${a})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw cursor dot
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.9)`;
        ctx.fill();

        // Cursor ring
        ctx.beginPath();
        ctx.arc(mx, my, MOUSE_RADIUS * 0.15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove",  onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchend",   onTouchEnd);
    };
  }, [resize, spawn]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1, pointerEvents: 'all', cursor: 'none' }}
    />
  );
}
