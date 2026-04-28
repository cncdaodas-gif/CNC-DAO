"use client";
import { useEffect, useRef, useCallback } from "react";
interface Particle { x:number; y:number; vx:number; vy:number; radius:number; opacity:number; pulsePhase:number; pulseSpeed:number; }
const MAX_DIST=160, MOUSE_RADIUS=200, COUNT=130;
const G={r:180,g:120,b:0};
export default function ParticleNetwork() {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const particles=useRef<Particle[]>([]);
  const mouse=useRef({x:-9999,y:-9999});
  const animId=useRef(0);
  const hovering=useRef(false);
  const resize=useCallback(()=>{ const c=canvasRef.current; if(!c)return; c.width=c.offsetWidth; c.height=c.offsetHeight; },[]);
  const spawn=useCallback((w:number,h:number):Particle=>({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.5, vy:(Math.random()-.5)*.5, radius:2.5+Math.random()*3, opacity:.55+Math.random()*.45, pulsePhase:Math.random()*Math.PI*2, pulseSpeed:.02+Math.random()*.03 }),[]);
  useEffect(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d")!;
    resize(); window.addEventListener("resize",resize);
    particles.current=Array.from({length:COUNT},()=>spawn(c.width,c.height));
    const onMove=(e:MouseEvent)=>{ const r=c.getBoundingClientRect(); mouse.current={x:e.clientX-r.left,y:e.clientY-r.top}; hovering.current=true; };
    const onLeave=()=>{ mouse.current={x:-9999,y:-9999}; hovering.current=false; };
    const onTouch=(e:TouchEvent)=>{ if(!e.touches.length)return; const r=c.getBoundingClientRect(); const t=e.touches[0]; mouse.current={x:t.clientX-r.left,y:t.clientY-r.top}; hovering.current=true; };
    const onTouchEnd=()=>setTimeout(()=>{ mouse.current={x:-9999,y:-9999}; hovering.current=false; },600);
    c.addEventListener("mousemove",onMove); c.addEventListener("mouseleave",onLeave);
    c.addEventListener("touchmove",onTouch,{passive:true}); c.addEventListener("touchstart",onTouch,{passive:true}); c.addEventListener("touchend",onTouchEnd);
    const draw=()=>{
      animId.current=requestAnimationFrame(draw);
      const w=c.width,h=c.height,mx=mouse.current.x,my=mouse.current.y;
      ctx.clearRect(0,0,w,h);
      for(const p of particles.current){
        p.x+=p.vx; p.y+=p.vy; p.pulsePhase+=p.pulseSpeed;
        if(p.x<-10)p.x=w+10; if(p.x>w+10)p.x=-10; if(p.y<-10)p.y=h+10; if(p.y>h+10)p.y=-10;
        const dx=p.x-mx,dy=p.y-my,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<MOUSE_RADIUS&&dist>0){ const f=(MOUSE_RADIUS-dist)/MOUSE_RADIUS,a=Math.atan2(dy,dx); p.vx+=Math.cos(a)*f*.6; p.vy+=Math.sin(a)*f*.6; }
        const spd=Math.sqrt(p.vx*p.vx+p.vy*p.vy); if(spd>2.5){p.vx=(p.vx/spd)*2.5;p.vy=(p.vy/spd)*2.5;}
        p.vx*=.99; p.vy*=.99;
        const pulse=.7+.3*Math.sin(p.pulsePhase);
        const near=dist<MOUSE_RADIUS?1+(1-dist/MOUSE_RADIUS)*1.2:1;
        const alpha=Math.min(1,p.opacity*pulse*near);
        const r=p.radius*(1+(dist<MOUSE_RADIUS?(1-dist/MOUSE_RADIUS)*1.5:0));
        ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${G.r},${G.g},${G.b},${alpha})`; ctx.fill();
      }
      for(let i=0;i<particles.current.length;i++){
        const a=particles.current[i];
        for(let j=i+1;j<particles.current.length;j++){
          const b=particles.current[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<MAX_DIST){
            const lo=(1-d/MAX_DIST)*.55;
            const ad=Math.sqrt((a.x-mx)**2+(a.y-my)**2),bd=Math.sqrt((b.x-mx)**2+(b.y-my)**2);
            const boost=Math.min(ad,bd)<MOUSE_RADIUS?2:1;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.strokeStyle=`rgba(${G.r},${G.g},${G.b},${Math.min(.85,lo*boost)})`; ctx.lineWidth=boost>1?1.5:.9; ctx.stroke();
          }
        }
      }
      if(hovering.current){
        for(const p of particles.current){
          const dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);
          if(d<MOUSE_RADIUS*1.2){ const a=(1-d/(MOUSE_RADIUS*1.2))*.6; ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(p.x,p.y); ctx.strokeStyle=`rgba(${G.r},${G.g},${G.b},${a})`; ctx.lineWidth=1; ctx.stroke(); }
        }
        ctx.beginPath(); ctx.arc(mx,my,4,0,Math.PI*2); ctx.fillStyle=`rgba(${G.r},${G.g},${G.b},0.9)`; ctx.fill();
        ctx.beginPath(); ctx.arc(mx,my,MOUSE_RADIUS*.15,0,Math.PI*2); ctx.strokeStyle=`rgba(${G.r},${G.g},${G.b},0.15)`; ctx.lineWidth=1; ctx.stroke();
      }
    };
    draw();
    return()=>{ cancelAnimationFrame(animId.current); window.removeEventListener("resize",resize); c.removeEventListener("mousemove",onMove); c.removeEventListener("mouseleave",onLeave); };
  },[resize,spawn]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex:1, pointerEvents:'all', cursor:'none' }} />;
}
