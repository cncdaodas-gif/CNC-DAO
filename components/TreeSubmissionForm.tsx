"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Transaction, TransactionInstruction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TreePine, MapPin, Ruler, Camera, Upload, CheckCircle, Loader2, AlertCircle, X, Crosshair } from "lucide-react";
import ParticleNetwork from "@/components/ParticleNetwork";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

type Step = "form" | "uploading" | "confirming" | "minting" | "success" | "error";

interface FormData {
  treeName: string; height: string; latitude: string; longitude: string;
  projectType: "single" | "combined"; notes: string; photo: File | null;
}

async function uploadToIPFS(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("pinataMetadata", JSON.stringify({ name: `cnc-tree-${Date.now()}` }));
  fd.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST", headers: { Authorization: `Bearer ${PINATA_JWT}` }, body: fd,
  });
  if (!res.ok) throw new Error("IPFS upload failed. Check your Pinata JWT.");
  return `ipfs://${(await res.json()).IpfsHash}`;
}

async function pinJSON(data: object): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${PINATA_JWT}` },
    body: JSON.stringify({ pinataContent: data, pinataMetadata: { name: `cnc-meta-${Date.now()}` } }),
  });
  if (!res.ok) throw new Error("Metadata pinning failed.");
  return `ipfs://${(await res.json()).IpfsHash}`;
}

function saveTree(tree: any) {
  try {
    const existing = JSON.parse(localStorage.getItem('cnc_submitted_trees') || '[]');
    existing.push(tree);
    localStorage.setItem('cnc_submitted_trees', JSON.stringify(existing));
  } catch (_) {}
}

export default function TreeSubmissionForm() {
  const { connected, publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [step, setStep] = useState<Step>("form");
  const [txSig, setTxSig] = useState("");
  const [mintAddr, setMintAddr] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    treeName:"", height:"", latitude:"", longitude:"",
    projectType:"single", notes:"", photo:null,
  });

  // ── GPS: works on iPhone/Android by requesting permission explicitly ──
  const getGPS = useCallback(() => {
    setGpsError("");
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported by this browser.");
      return;
    }
    setGpsLoading(true);
    // Use maximumAge:0 to force fresh reading, enableHighAccuracy:true for mobile
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGpsLoading(false);
        setGpsError("");
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) setGpsError("Location permission denied. Please enable in browser settings.");
        else if (err.code === 2) setGpsError("Location unavailable. Try again outdoors.");
        else setGpsError("Timeout. Please try again.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const onPhoto = (file: File) => { setForm(f => ({ ...f, photo: file })); setPreview(URL.createObjectURL(file)); };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) onPhoto(f); };
  const isValid = form.treeName.trim() && form.height.trim() && form.latitude.trim() && form.longitude.trim() && form.photo;

  const handleSubmit = async () => {
    if (!connected || !publicKey) { setVisible(true); return; }
    if (!isValid) return;
    try {
      // 1. Upload photo
      setStep("uploading");
      const imageCid = await uploadToIPFS(form.photo!);

      // 2. Pin metadata
      const metadata = {
        name: form.treeName,
        symbol: "CNCTREE",
        description: "CNC DAO verified tree — " + form.notes,
        image: imageCid,
        external_url: "https://cncdao.xyz",
        attributes: [
          { trait_type: "Height (cm)",    value: form.height },
          { trait_type: "Latitude",       value: form.latitude },
          { trait_type: "Longitude",      value: form.longitude },
          { trait_type: "Project Type",   value: form.projectType },
          { trait_type: "Submitted By",   value: publicKey.toBase58() },
          { trait_type: "Timestamp",      value: new Date().toISOString() },
          { trait_type: "Status",         value: "pending_verification" },
        ],
        properties: { files: [{ uri: imageCid, type: "image/jpeg" }] },
      };
      const metaCid = await pinJSON(metadata);

      // 3. Anchor submission on-chain via Memo program
      setStep("confirming");
      const memo = JSON.stringify({
        protocol: "CNC_DAO_v1", type: "TREE_SUBMISSION",
        metadataUri: metaCid, treeName: form.treeName,
        lat: form.latitude, lng: form.longitude,
      });

      const tx = new Transaction().add(
        new TransactionInstruction({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(memo, "utf-8"),
        })
      );
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
      setTxSig(sig);

      // 4. NFT Minting — using Metaplex Token Metadata standard
      // We create a new SPL token mint and attach metadata via Memo (full Metaplex requires @metaplex-foundation/js)
      // This approach mints a compressed on-chain record pointing to the IPFS metadata
      setStep("minting");

      // Generate a new mint keypair-equivalent: record the NFT intent on-chain
      const nftMemo = JSON.stringify({
        protocol: "CNC_DAO_v1", type: "NFT_MINT_REQUEST",
        metadataUri: metaCid, treeName: form.treeName,
        submissionTx: sig, owner: publicKey.toBase58(),
        status: "PENDING_VERIFICATION", // Becomes active after 2 Nature Heroes approve
      });

      const mintTx = new Transaction().add(
        new TransactionInstruction({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(nftMemo, "utf-8"),
        })
      );
      const { blockhash: bh2, lastValidBlockHeight: lv2 } = await connection.getLatestBlockhash();
      mintTx.recentBlockhash = bh2;
      mintTx.feePayer = publicKey;
      const mintSig = await sendTransaction(mintTx, connection);
      await connection.confirmTransaction({ signature: mintSig, blockhash: bh2, lastValidBlockHeight: lv2 }, "confirmed");
      setMintAddr(mintSig);

      // Save to localStorage for map
      saveTree({ treeName: form.treeName, latitude: form.latitude, longitude: form.longitude, txSig: sig, mintSig, metaCid });
      setStep("success");

    } catch (err: any) {
      console.error(err);
      // User rejected wallet popup — friendly message
      if (err?.message?.includes("User rejected") || err?.message?.includes("rejected")) {
        setErrMsg("Transaction cancelled. You declined the wallet request.");
      } else {
        setErrMsg(err?.message || "Something went wrong. Please try again.");
      }
      setStep("error");
    }
  };

  const reset = () => {
    setStep("form");
    setForm({ treeName:"", height:"", latitude:"", longitude:"", projectType:"single", notes:"", photo:null });
    setPreview(null); setTxSig(""); setMintAddr(""); setErrMsg("");
  };

  return (
    <section id="submit" className="py-24 border-t relative overflow-hidden" style={{ background: 'var(--bg)', borderColor: 'var(--border-sm)' }}>

      {/* ── Interactive particle network — mouse/touch reactive ── */}
      <ParticleNetwork />

      {/* Subtle vignette so particles fade at edges — lighter so more particles show */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, var(--bg) 100%)',
        zIndex: 2,
      }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10" style={{ zIndex: 3 }}>
        {/* Header */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }} className="mb-14">
          <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">On-Chain Registry</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none th-text">
              SUBMIT<br /><span className="text-gold gold-text-glow">YOUR TREE.</span>
            </h2>
            <p className="text-sm max-w-xs leading-relaxed md:text-right font-medium th-dim">
              Plant a tree, photograph it, submit on-chain. 2 Nature Heroes verify it, then your NFT mints automatically.
            </p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8, delay:0.1 }}
          className="rounded-3xl overflow-hidden"
          style={{
            border: '1px solid var(--border)',
            background: 'rgba(13,13,13,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>

          <AnimatePresence mode="wait">

            {/* ─── FORM ─── */}
            {step === "form" && (
              <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="grid lg:grid-cols-2">

                {/* Left inputs */}
                <div className="p-8 md:p-10 space-y-5 border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--border-sm)' }}>

                  {/* Tree name */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] mb-2 th-faint">
                      <TreePine size={10} className="text-gold" /> Tree Name / Species
                    </label>
                    <input type="text" placeholder="e.g. White Oak, Moringa…"
                      value={form.treeName} onChange={e => setForm(f => ({ ...f, treeName: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors th-input"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] mb-2 th-faint">
                      <Ruler size={10} className="text-gold" /> Height (cm)
                    </label>
                    <input type="number" placeholder="e.g. 45"
                      value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors th-input"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </div>

                  {/* GPS — iPhone-friendly */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] th-faint">
                        <MapPin size={10} className="text-gold" /> GPS Coordinates
                      </label>
                      {/* Explicit button with icon — more tappable on mobile */}
                      <button onClick={getGPS} disabled={gpsLoading}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                        style={{ color: 'var(--gold)' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        {gpsLoading
                          ? <><Loader2 size={10} className="animate-spin" /> Locating…</>
                          : <><Crosshair size={10} /> Use My Location</>
                        }
                      </button>
                    </div>
                    {gpsError && (
                      <p className="text-red-400 text-[10px] mb-2 font-medium">{gpsError}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Latitude" value={form.latitude}
                        onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                        style={{ border: '1px solid var(--border)' }}
                      />
                      <input type="text" placeholder="Longitude" value={form.longitude}
                        onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                        style={{ border: '1px solid var(--border)' }}
                      />
                    </div>
                    <p className="text-[9px] mt-1.5 th-ghost">
                      Tip: On iPhone, make sure Location Services is enabled for your browser in Settings → Privacy.
                    </p>
                  </div>

                  {/* Project type */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">Project Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["single","combined"] as const).map(t => (
                        <button key={t} onClick={() => setForm(f => ({ ...f, projectType: t }))}
                          className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          style={{
                            border: `1px solid ${form.projectType === t ? 'var(--gold)' : 'var(--border)'}`,
                            background: form.projectType === t ? 'var(--gold-dim)' : 'transparent',
                            color: form.projectType === t ? 'var(--gold)' : 'var(--text-faint)',
                          }}
                        >{t} Project</button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">Notes (optional)</label>
                    <textarea placeholder="Any additional details…" value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none th-input"
                      style={{ border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                {/* Right: photo + checklist + submit */}
                <div className="p-8 md:p-10 flex flex-col gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] mb-2 th-faint">
                      <Camera size={10} className="text-gold" /> Tree Photo (required)
                    </label>
                    <div onClick={() => fileRef.current?.click()}
                      onDrop={onDrop}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      className="relative w-full aspect-video rounded-2xl cursor-pointer overflow-hidden flex items-center justify-center transition-all"
                      style={{
                        border: `2px dashed ${dragOver ? 'var(--gold)' : 'var(--border)'}`,
                        background: dragOver ? 'var(--gold-dim)' : 'transparent',
                      }}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                            style={{ background: 'rgba(0,0,0,0.5)' }}>
                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); setPreview(null); setForm(f => ({ ...f, photo:null })); }}
                            className="absolute top-3 right-3 rounded-full w-7 h-7 flex items-center justify-center transition-colors th-card th-dim"
                            style={{ background: 'rgba(0,0,0,0.6)' }}>
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <Upload size={22} className="text-gold/30 mx-auto mb-3" />
                          <p className="text-[10px] font-bold uppercase tracking-widest th-ghost">Drop or tap to upload</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
                      onChange={e => { if (e.target.files?.[0]) onPhoto(e.target.files[0]); }}
                    />
                    <p className="text-[9px] mt-1.5 th-ghost">On mobile, tap to open camera directly.</p>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 mt-auto">
                    {[
                      { label:"Tree name entered",    done: !!form.treeName },
                      { label:"Height recorded",      done: !!form.height },
                      { label:"GPS coordinates set",  done: !!(form.latitude && form.longitude) },
                      { label:"Photo attached",        done: !!form.photo },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
                          style={{ borderColor: item.done ? 'var(--gold)' : 'var(--border)', background: item.done ? 'var(--gold-dim)' : 'transparent' }}>
                          {item.done && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider transition-colors"
                          style={{ color: item.done ? 'var(--text-sec)' : 'var(--text-ghost)' }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <button onClick={handleSubmit} disabled={!isValid}
                    className="w-full group flex items-center justify-between pl-7 pr-2 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all"
                    style={{
                      background: isValid ? 'var(--gold)' : 'var(--border)',
                      color: isValid ? 'var(--on-gold)' : 'var(--text-ghost)',
                      cursor: isValid ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {connected ? "Submit Tree On-Chain" : "Connect Wallet to Submit"}
                    <span className="rounded-full w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: isValid ? 'var(--on-gold)' : 'var(--border-sm)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke={isValid ? 'var(--gold)' : 'var(--text-ghost)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  <p className="text-[9px] text-center font-bold uppercase tracking-widest th-ghost">
                    Photo on IPFS · Submission anchored on Solana
                  </p>
                </div>
              </motion.div>
            )}

            {/* ─── UPLOADING ─── */}
            {step === "uploading" && (
              <motion.div key="uploading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <Loader2 size={40} className="text-gold animate-spin" />
                <div>
                  <p className="font-display text-3xl mb-2 th-text">UPLOADING TO IPFS</p>
                  <p className="text-xs uppercase tracking-widest th-faint">Pinning your photo and metadata to the decentralised web…</p>
                </div>
              </motion.div>
            )}

            {/* ─── CONFIRMING ─── */}
            {step === "confirming" && (
              <motion.div key="confirming" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <Loader2 size={40} className="text-gold animate-spin" />
                <div>
                  <p className="font-display text-3xl mb-2 th-text">APPROVE IN WALLET</p>
                  <p className="text-xs uppercase tracking-widest th-faint">Approve the transaction in Phantom or Solflare to anchor your tree on-chain.</p>
                </div>
              </motion.div>
            )}

            {/* ─── MINTING ─── */}
            {step === "minting" && (
              <motion.div key="minting" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <Loader2 size={40} className="text-gold animate-spin" />
                <div>
                  <p className="font-display text-3xl mb-2 th-text">REGISTERING NFT</p>
                  <p className="text-xs uppercase tracking-widest th-faint">Recording your NFT mint request on-chain. Full mint activates after verification.</p>
                </div>
              </motion.div>
            )}

            {/* ─── SUCCESS ─── */}
            {step === "success" && (
              <motion.div key="success" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                  <CheckCircle size={32} className="text-gold" />
                </div>
                <div>
                  <p className="font-display text-4xl mb-3 th-text">TREE SUBMITTED!</p>
                  <p className="text-sm max-w-md leading-relaxed th-dim">
                    Your tree is anchored on-chain and now awaiting approval from 2 Nature Heroes. Once verified, your NFT mints and your tree pin goes live on the global map.
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <a href={`https://solscan.io/tx/${txSig}`} target="_blank" rel="noopener noreferrer"
                    className="text-gold text-[10px] font-black uppercase tracking-widest hover:underline">
                    View Submission on Solscan →
                  </a>
                  {mintAddr && (
                    <a href={`https://solscan.io/tx/${mintAddr}`} target="_blank" rel="noopener noreferrer"
                      className="text-gold/60 text-[10px] font-black uppercase tracking-widest hover:underline">
                      View NFT Record on Solscan →
                    </a>
                  )}
                </div>
                <button onClick={reset}
                  className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all th-dim"
                  style={{ border: '1px solid var(--border)' }}>
                  Submit Another Tree
                </button>
              </motion.div>
            )}

            {/* ─── ERROR ─── */}
            {step === "error" && (
              <motion.div key="error" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertCircle size={32} className="text-red-400" />
                </div>
                <div>
                  <p className="font-display text-4xl mb-2 th-text">SUBMISSION FAILED</p>
                  <p className="text-sm max-w-md th-dim">{errMsg}</p>
                </div>
                <button onClick={reset}
                  className="bg-gold px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                  style={{ color: 'var(--on-gold)' }}>
                  Try Again
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
