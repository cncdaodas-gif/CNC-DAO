"use client";
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { TreePine, CheckCircle, Award, Globe } from 'lucide-react';

// Seed project locations
const SEED = [
  { lat: -3.4653,  lng: -62.2159, name: 'Amazon Basin',    trees: '12,541', isUser: false },
  { lat: -0.2280,  lng: 23.6345,  name: 'Congo Rainforest', trees: '8,210',  isUser: false },
  { lat:  0.9619,  lng: 114.5548, name: 'Borneo Highlands', trees: '19,091', isUser: false },
];

const STATS = [
  { icon: TreePine,     label: 'Trees Planted',    value: '39,842' },
  { icon: CheckCircle,  label: 'Verified On-Chain', value: '37,842' },
  { icon: Award,        label: 'NFTs Minted',       value: '12,441' },
  { icon: Globe,        label: 'Active Projects',   value: '127' },
];

export default function ImpactMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const [userTrees, setUserTrees] = useState<any[]>([]);

  // Load user submitted trees from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cnc_submitted_trees');
      if (stored) setUserTrees(JSON.parse(stored));
    } catch (_) {}
  }, []);

  // Init Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    // Dynamically import Leaflet (client only)
    import('leaflet').then(L => {
      // Fix default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      const map = L.map(mapRef.current!, {
        center: [10, 20],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
      });

      leafletRef.current = map;

      // Tile layer — use CartoDB dark/light based on theme
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      // Gold pulse icon for seed projects
      const goldIcon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;background:#FFD700;border-radius:50%;box-shadow:0 0 0 4px rgba(255,215,0,0.25),0 0 16px #FFD700;position:relative;">
                <div style="position:absolute;inset:-6px;border-radius:50%;background:rgba(255,215,0,0.2);animation:ping-slow 2.5s ease-out infinite;"></div>
               </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      // Green icon for user trees
      const greenIcon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;background:#4ade80;border-radius:50%;box-shadow:0 0 0 3px rgba(74,222,128,0.25),0 0 12px #4ade80;">
               </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      // Add seed markers
      SEED.forEach(p => {
        L.marker([p.lat, p.lng], { icon: goldIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;padding:4px 2px">
              <div style="font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">${p.name}</div>
              <div style="color:#FFD700;font-weight:700;font-size:10px;margin-top:2px">${p.trees} TREES</div>
            </div>`
          );
      });

      // Add user tree markers
      const stored = (() => { try { return JSON.parse(localStorage.getItem('cnc_submitted_trees') || '[]'); } catch { return []; } })();
      stored.forEach((t: any) => {
        const lat = parseFloat(t.latitude);
        const lng = parseFloat(t.longitude);
        if (isNaN(lat) || isNaN(lng)) return;
        L.marker([lat, lng], { icon: greenIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;padding:4px 2px">
              <div style="font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">🌱 ${t.treeName}</div>
              <div style="color:#4ade80;font-weight:700;font-size:10px;margin-top:2px">Your submission</div>
            </div>`
          );
      });

      // Attribution
      L.control.attribution({ position: 'bottomleft', prefix: '© OpenStreetMap · CartoDB' }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Theme change listener
      const onTheme = () => {
        const dark = document.documentElement.getAttribute('data-theme') !== 'light';
        map.eachLayer(l => { if ((l as any)._url) map.removeLayer(l); });
        L.tileLayer(
          dark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
               : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          { maxZoom: 19 }
        ).addTo(map);
      };

      const observer = new MutationObserver(onTheme);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      return () => observer.disconnect();
    });
  }, []);

  return (
    <section id="impact" className="py-24 border-t overflow-hidden" style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-sm)' }}>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }} className="mb-10">
          <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">Live Oracle Data</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none th-text">
              GLOBAL<br /><span className="text-gold gold-text-glow">TOPOGRAPHY</span>
            </h2>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] th-faint">Live · Updated every 30s</p>
              </div>
              {userTrees.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-green-400/80 text-[9px] font-black uppercase tracking-widest">
                    {userTrees.length} tree{userTrees.length > 1 ? 's' : ''} you submitted
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.6, delay: i*0.08 }}
              className="rounded-2xl p-5 th-card">
              <s.icon size={15} className="text-gold mb-3 opacity-70" />
              <p className="font-display text-3xl text-gold">{s.value}</p>
              <p className="text-[9px] uppercase tracking-widest mt-1 th-faint">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Map container */}
        <motion.div ref={ref}
          initial={{ opacity:0, scale:0.98 }} animate={inView ? { opacity:1, scale:1 } : {}}
          transition={{ duration:1, ease:[0.16,1,0.3,1] }}
          className="relative rounded-2xl overflow-hidden gold-glow"
          style={{ height: '520px', border: '1px solid var(--border)' }}
        >
          <div ref={mapRef} className="w-full h-full" />

          {/* Legend */}
          <div className="absolute top-4 left-4 z-[1000] rounded-xl px-4 py-3 flex flex-col gap-2"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gold" />
              <span className="text-white text-[9px] font-black uppercase tracking-widest">DAO Project</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-white text-[9px] font-black uppercase tracking-widest">Your Submission</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link href="/impact-map"
            className="group inline-flex items-center gap-3 border pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all th-dim th-border hover:text-gold"
            style={{ borderColor: 'var(--border)' }}>
            Explore Full Map
            <span className="border rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
