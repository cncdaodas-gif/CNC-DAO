"use client";
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { TreePine, CheckCircle, Award, Globe, Search, Filter, X, Layers, ZoomIn, ZoomOut, Locate } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:'amazon',  lat:-3.4653,  lng:-62.2159, name:'Amazon Basin',     country:'Brazil',   trees:12541, verified:11890, nfts:9201,  status:'active',  type:'reforestation' },
  { id:'congo',   lat:-0.2280,  lng:23.6345,  name:'Congo Rainforest', country:'DRC',      trees:8210,  verified:7844,  nfts:6100,  status:'active',  type:'conservation' },
  { id:'borneo',  lat:0.9619,   lng:114.5548, name:'Borneo Highlands', country:'Malaysia', trees:19091, verified:18108, nfts:14200, status:'active',  type:'reforestation' },
  { id:'kenya',   lat:-1.2921,  lng:36.8219,  name:'Nairobi Green Belt',country:'Kenya',   trees:4200,  verified:3900,  nfts:2800,  status:'active',  type:'urban' },
  { id:'brazil2', lat:-15.7942, lng:-47.8822, name:'Cerrado Corridor', country:'Brazil',   trees:7800,  verified:6900,  nfts:5100,  status:'pending', type:'conservation' },
  { id:'india',   lat:20.5937,  lng:78.9629,  name:'Western Ghats',    country:'India',    trees:5600,  verified:4800,  nfts:3400,  status:'active',  type:'reforestation' },
];

const STATUS_COLOR: Record<string, string> = { active:'#4ade80', pending:'#FFD700' };
const TYPE_ICON: Record<string, string>    = { reforestation:'🌳', conservation:'🛡️', urban:'🏙️' };

const STATS = [
  { icon:TreePine,    label:'Trees Planted',    value:'57,442' },
  { icon:CheckCircle, label:'Verified On-Chain', value:'53,441' },
  { icon:Award,       label:'NFTs Minted',       value:'40,801' },
  { icon:Globe,       label:'Active Projects',   value:'6' },
];

// ── Custom CSS injected once ──────────────────────────────────────────
const MAP_STYLES = `
  .leaflet-container { font-family: 'Syne', sans-serif !important; background: transparent !important; }
  .leaflet-tile-pane { border-radius: 1.25rem; }
  .leaflet-control-zoom { display: none !important; }
  .leaflet-control-attribution { display: none !important; }
  .leaflet-popup-content-wrapper {
    background: rgba(10,10,10,0.95) !important;
    border: 1px solid rgba(255,215,0,0.25) !important;
    border-radius: 1rem !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(255,215,0,0.08) !important;
    backdrop-filter: blur(20px);
    padding: 0 !important;
    color: white !important;
  }
  .leaflet-popup-tip { background: rgba(10,10,10,0.95) !important; }
  .leaflet-popup-close-button { color: rgba(255,255,255,0.4) !important; top: 10px !important; right: 12px !important; font-size: 18px !important; }
  .leaflet-popup-close-button:hover { color: #FFD700 !important; }

  /* Light mode popup */
  [data-theme="light"] .leaflet-popup-content-wrapper {
    background: rgba(255,255,255,0.97) !important;
    border: 1px solid rgba(184,146,10,0.3) !important;
  }
  [data-theme="light"] .leaflet-popup-tip { background: rgba(255,255,255,0.97) !important; }
  [data-theme="light"] .leaflet-popup-close-button { color: rgba(0,0,0,0.4) !important; }

  /* Custom marker pulse */
  @keyframes markerPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.5), 0 0 12px rgba(255,215,0,0.4); }
    50%      { box-shadow: 0 0 0 12px rgba(255,215,0,0), 0 0 20px rgba(255,215,0,0.2); }
  }
  @keyframes greenPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5), 0 0 12px rgba(74,222,128,0.4); }
    50%      { box-shadow: 0 0 0 12px rgba(74,222,128,0), 0 0 20px rgba(74,222,128,0.2); }
  }
  .marker-gold  { animation: markerPulse 2.5s ease-in-out infinite; }
  .marker-green { animation: greenPulse  2.5s ease-in-out infinite; }
`;

export default function ImpactMap() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const mapRef      = useRef<HTMLDivElement>(null);
  const leafletRef  = useRef<any>(null);
  const inView      = useInView(sectionRef, { once: true, margin: '-80px' });

  const [userTrees,   setUserTrees]   = useState<any[]>([]);
  const [activeFilter, setFilter]     = useState<string>('all');
  const [searchQuery,  setSearch]     = useState('');
  const [selectedProject, setSelected] = useState<typeof PROJECTS[0] | null>(null);
  const [mapReady,    setMapReady]    = useState(false);
  const [tileLayer,   setTileLayer]   = useState<any>(null);

  // ── Inject CSS once ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = 'cnc-map-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = MAP_STYLES;
      document.head.appendChild(s);
    }
    try {
      const stored = localStorage.getItem('cnc_submitted_trees');
      if (stored) setUserTrees(JSON.parse(stored));
    } catch (_) {}
  }, []);

  // ── Init Leaflet ──
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [5, 20], zoom: 2,
        zoomControl: false, attributionControl: false,
        scrollWheelZoom: true, dragging: true,
      });
      leafletRef.current = map;

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const tile = L.tileLayer(
        isDark
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 18 }
      ).addTo(map);
      setTileLayer(tile);

      // ── Custom marker factory ──
      const makeMarker = (color: string, size: number, cls: string) => L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:${size}px;height:${size}px">
            <div style="
              width:100%;height:100%;
              background:${color};
              border-radius:50%;
              border:2.5px solid rgba(255,255,255,0.9);
              display:flex;align-items:center;justify-content:center;
            " class="${cls}"></div>
          </div>`,
        iconSize:   [size, size],
        iconAnchor: [size/2, size/2],
      });

      // ── Add project markers ──
      PROJECTS.forEach(p => {
        const color = STATUS_COLOR[p.status];
        const cls   = p.status === 'active' ? 'marker-green' : 'marker-gold';
        const marker = L.marker([p.lat, p.lng], { icon: makeMarker(color, 22, cls) }).addTo(map);

        // Rich popup HTML
        const pct = Math.round((p.verified / p.trees) * 100);
        marker.bindPopup(`
          <div style="padding:16px;min-width:220px;font-family:'Syne',sans-serif">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
              <span style="font-size:18px">${TYPE_ICON[p.type]}</span>
              <div>
                <div style="font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:${color}">${p.name}</div>
                <div style="font-size:10px;opacity:0.5;text-transform:uppercase;letter-spacing:0.1em">${p.country}</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
              <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:8px">
                <div style="font-size:18px;font-weight:800;color:${color}">${p.trees.toLocaleString()}</div>
                <div style="font-size:9px;opacity:0.4;text-transform:uppercase;letter-spacing:0.1em">Planted</div>
              </div>
              <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:8px">
                <div style="font-size:18px;font-weight:800;color:#fff">${p.nfts.toLocaleString()}</div>
                <div style="font-size:9px;opacity:0.4;text-transform:uppercase;letter-spacing:0.1em">NFTs</div>
              </div>
            </div>
            <div style="margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;font-size:9px;opacity:0.5;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">
                <span>Verified</span><span style="color:${color}">${pct}%</span>
              </div>
              <div style="height:3px;background:rgba(255,255,255,0.1);border-radius:99px">
                <div style="height:100%;width:${pct}%;background:${color};border-radius:99px;transition:width 0.5s ease"></div>
              </div>
            </div>
            <div style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;background:${color}20;border:1px solid ${color}40">
              <div style="width:5px;height:5px;border-radius:50%;background:${color}"></div>
              <span style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:${color}">${p.status}</span>
            </div>
          </div>`, { maxWidth: 260 });

        marker.on('click', () => setSelected(p));
      });

      // ── User submitted trees ──
      const stored = (() => { try { return JSON.parse(localStorage.getItem('cnc_submitted_trees') || '[]'); } catch { return []; } })();
      stored.forEach((t: any) => {
        const lat = parseFloat(t.latitude), lng = parseFloat(t.longitude);
        if (isNaN(lat) || isNaN(lng)) return;
        L.marker([lat, lng], { icon: makeMarker('#FFD700', 18, 'marker-gold') })
          .addTo(map)
          .bindPopup(`
            <div style="padding:14px;font-family:'Syne',sans-serif">
              <div style="font-size:20px;margin-bottom:6px">🌱</div>
              <div style="font-weight:800;font-size:12px;color:#FFD700;text-transform:uppercase">${t.treeName}</div>
              <div style="font-size:10px;opacity:0.5;margin-top:2px">Your submission</div>
            </div>`);
      });

      // ── Theme observer ──
      const observer = new MutationObserver(() => {
        const dark = document.documentElement.getAttribute('data-theme') !== 'light';
        map.eachLayer((l: any) => { if (l._url) map.removeLayer(l); });
        L.tileLayer(
          dark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
               : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          { maxZoom: 18 }
        ).addTo(map);
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      setMapReady(true);
      return () => observer.disconnect();
    });
  }, []);

  // ── Map controls ──
  const zoomIn  = () => leafletRef.current?.zoomIn();
  const zoomOut = () => leafletRef.current?.zoomOut();
  const locate  = () => {
    if (!leafletRef.current) return;
    navigator.geolocation.getCurrentPosition(pos => {
      leafletRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 8, { duration: 1.5 });
    });
  };
  const flyTo = (lat: number, lng: number) => {
    leafletRef.current?.flyTo([lat, lng], 6, { duration: 1.2 });
  };

  const filtered = PROJECTS.filter(p => {
    const matchFilter = activeFilter === 'all' || p.status === activeFilter || p.type === activeFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <section id="impact" ref={sectionRef} className="py-20 border-t relative overflow-hidden"
      style={{ background:'var(--bg-deep)', borderColor:'var(--border-sm)' }}>

      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="overflow-hidden mb-1">
              <motion.p initial={{ y:'100%' }} whileInView={{ y:0 }} viewport={{ once:true }}
                transition={{ duration:0.7 }} className="text-gold text-[9px] font-black uppercase tracking-[0.4em]">
                Live Oracle Data
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.h2 initial={{ y:'100%' }} whileInView={{ y:0 }} viewport={{ once:true }}
                transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
                className="font-display leading-none th-text" style={{ fontSize:'clamp(2.5rem,7vw,6rem)' }}>
                GLOBAL <span className="text-gold gold-text-glow">IMPACT MAP</span>
              </motion.h2>
            </div>
          </div>
          {userTrees.length > 0 && (
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">
                {userTrees.length} tree{userTrees.length > 1 ? 's' : ''} submitted by you
              </p>
            </motion.div>
          )}
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.07 }}
              className="rounded-2xl p-4 flex items-center gap-3 th-card"
              style={{ border:'1px solid var(--border)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                <s.icon size={14} className="text-gold" />
              </div>
              <div>
                <p className="font-display text-xl text-gold leading-none">{s.value}</p>
                <p className="text-[9px] uppercase tracking-wider th-ghost mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main map layout ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          className="rounded-2xl overflow-hidden gold-glow"
          style={{ border:'1px solid var(--border)' }}>

          <div className="flex flex-col lg:flex-row" style={{ height:'600px' }}>

            {/* ── Left sidebar ── */}
            <div className="lg:w-72 shrink-0 flex flex-col h-48 lg:h-full"
              style={{ background:'var(--bg-card)', borderRight:'1px solid var(--border)' }}>

              {/* Search */}
              <div className="p-3" style={{ borderBottom:'1px solid var(--border)' }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background:'var(--bg)', border:'1px solid var(--border)' }}>
                  <Search size={12} className="text-gold shrink-0 opacity-70" />
                  <input
                    type="text" placeholder="Search projects…"
                    value={searchQuery} onChange={e => setSearch(e.target.value)}
                    className="bg-transparent text-[11px] font-medium outline-none w-full th-text"
                    style={{ color:'var(--text-pri)' }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearch('')}>
                      <X size={11} className="th-ghost hover:text-gold transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="p-3 flex flex-wrap gap-1.5" style={{ borderBottom:'1px solid var(--border)' }}>
                {['all','active','pending','reforestation','conservation','urban'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all"
                    style={{
                      background: activeFilter === f ? 'var(--gold)' : 'var(--bg)',
                      color:      activeFilter === f ? 'var(--on-gold)' : 'var(--text-faint)',
                      border:     `1px solid ${activeFilter === f ? 'var(--gold)' : 'var(--border)'}`,
                    }}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Project list */}
              <div className="flex-1 overflow-y-auto">
                {filtered.map((p, i) => (
                  <motion.button key={p.id}
                    initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:i*0.05 }}
                    onClick={() => { setSelected(p); flyTo(p.lat, p.lng); }}
                    className="w-full text-left p-3 transition-all"
                    style={{
                      borderBottom:'1px solid var(--border-sm)',
                      background: selectedProject?.id === p.id ? 'var(--gold-dim)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (selectedProject?.id !== p.id) (e.currentTarget.style.background = 'var(--bg)'); }}
                    onMouseLeave={e => { if (selectedProject?.id !== p.id) (e.currentTarget.style.background = 'transparent'); }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{TYPE_ICON[p.type]}</span>
                        <span className="text-[11px] font-black uppercase tracking-tight th-text">{p.name}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background:STATUS_COLOR[p.status] }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] th-ghost">{p.country}</span>
                      <span className="text-[9px] font-black" style={{ color:STATUS_COLOR[p.status] }}>
                        {p.trees.toLocaleString()} trees
                      </span>
                    </div>
                    {/* Mini progress */}
                    <div className="mt-2 h-0.5 rounded-full" style={{ background:'var(--border)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width:`${(p.verified/p.trees)*100}%`, background:STATUS_COLOR[p.status] }} />
                    </div>
                  </motion.button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-[10px] th-ghost uppercase tracking-widest">No projects found</p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="p-3 flex items-center gap-4" style={{ borderTop:'1px solid var(--border)' }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest th-ghost">Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                  <span className="text-[8px] font-black uppercase tracking-widest th-ghost">Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background:'#FFD700' }} />
                  <span className="text-[8px] font-black uppercase tracking-widest th-ghost">Your Tree</span>
                </div>
              </div>
            </div>

            {/* ── Map ── */}
            <div className="flex-1 relative min-h-[300px]">
              <div ref={mapRef} className="w-full h-full" />

              {/* Map loading state */}
              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background:'var(--bg-card)' }}>
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest th-ghost">Loading map…</p>
                  </div>
                </div>
              )}

              {/* Map controls */}
              <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
                {[
                  { icon:ZoomIn,  fn:zoomIn,  tip:'Zoom in' },
                  { icon:ZoomOut, fn:zoomOut, tip:'Zoom out' },
                  { icon:Locate,  fn:locate,  tip:'My location' },
                ].map(({ icon:Icon, fn, tip }) => (
                  <button key={tip} onClick={fn} title={tip}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                    style={{
                      background:'rgba(0,0,0,0.8)',
                      border:'1px solid rgba(255,215,0,0.2)',
                      color:'rgba(255,255,255,0.7)',
                      backdropFilter:'blur(12px)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as any).style.borderColor='rgba(255,215,0,0.6)'; (e.currentTarget as any).style.color='#FFD700'; }}
                    onMouseLeave={e => { (e.currentTarget as any).style.borderColor='rgba(255,215,0,0.2)'; (e.currentTarget as any).style.color='rgba(255,255,255,0.7)'; }}>
                    <Icon size={14} />
                  </button>
                ))}
              </div>

              {/* Live badge */}
              <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-[9px] font-black uppercase tracking-widest">Live</span>
              </div>

              {/* Selected project detail card */}
              <AnimatePresence>
                {selectedProject && (
                  <motion.div
                    initial={{ opacity:0, y:10, scale:0.97 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:10, scale:0.97 }}
                    transition={{ duration:0.2 }}
                    className="absolute bottom-3 left-3 right-14 z-[1000] rounded-xl p-4"
                    style={{
                      background:'rgba(0,0,0,0.88)',
                      border:`1px solid ${STATUS_COLOR[selectedProject.status]}40`,
                      backdropFilter:'blur(20px)',
                      boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${STATUS_COLOR[selectedProject.status]}15`,
                    }}>
                    <button onClick={() => setSelected(null)}
                      className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors">
                      <X size={13} />
                    </button>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{TYPE_ICON[selectedProject.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-xs uppercase tracking-tight text-white truncate">{selectedProject.name}</p>
                          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                            style={{ background:`${STATUS_COLOR[selectedProject.status]}20`, color:STATUS_COLOR[selectedProject.status], border:`1px solid ${STATUS_COLOR[selectedProject.status]}40` }}>
                            {selectedProject.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-white/40 mb-2">{selectedProject.country}</p>
                        <div className="flex gap-4">
                          <div><p className="font-black text-sm" style={{ color:STATUS_COLOR[selectedProject.status] }}>{selectedProject.trees.toLocaleString()}</p><p className="text-[8px] text-white/30 uppercase tracking-widest">Trees</p></div>
                          <div><p className="font-black text-sm text-white">{selectedProject.verified.toLocaleString()}</p><p className="text-[8px] text-white/30 uppercase tracking-widest">Verified</p></div>
                          <div><p className="font-black text-sm text-white/70">{selectedProject.nfts.toLocaleString()}</p><p className="text-[8px] text-white/30 uppercase tracking-widest">NFTs</p></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          transition={{ delay:0.3 }} className="mt-6 flex justify-center">
          <Link href="/impact-map"
            className="group inline-flex items-center gap-3 border pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all th-dim hover:text-gold"
            style={{ borderColor:'var(--border)' }}>
            Explore Full Map
            <span className="border rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              style={{ borderColor:'var(--border)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
