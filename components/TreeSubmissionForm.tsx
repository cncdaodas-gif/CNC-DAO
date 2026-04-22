"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from "@solana/web3.js";
import { TreePine, MapPin, Ruler, Camera, Upload, CheckCircle, Loader2, AlertCircle, X } from "lucide-react";

// ─── PINATA CONFIG ────────────────────────────────────────────────────────────
// Add your Pinata JWT to your Vercel environment variables as NEXT_PUBLIC_PINATA_JWT
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Step = "form" | "uploading" | "confirming" | "success" | "error";

interface FormData {
  treeName: string;
  height: string;
  latitude: string;
  longitude: string;
  projectType: "single" | "combined";
  notes: string;
  photo: File | null;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("pinataMetadata", JSON.stringify({ name: `cnc-dao-tree-${Date.now()}` }));
  formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload image to IPFS");
  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
}

async function pinMetadata(metadata: object): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: `cnc-dao-metadata-${Date.now()}` },
    }),
  });

  if (!res.ok) throw new Error("Failed to pin metadata to IPFS");
  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
}

// Memo program ID — we use a memo instruction to store the IPFS CID on-chain
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function TreeSubmissionForm() {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();

  const [step, setStep] = useState<Step>("form");
  const [txSignature, setTxSignature] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    treeName: "",
    height: "",
    latitude: "",
    longitude: "",
    projectType: "single",
    notes: "",
    photo: null,
  });

  // Auto-fill GPS from browser
  const getGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({
        ...f,
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
      }));
    });
  }, []);

  const handlePhoto = (file: File) => {
    setForm((f) => ({ ...f, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handlePhoto(file);
  };

  const isValid =
    form.treeName.trim() &&
    form.height.trim() &&
    form.latitude.trim() &&
    form.longitude.trim() &&
    form.photo;

  const handleSubmit = async () => {
    if (!connected || !publicKey) { setVisible(true); return; }
    if (!isValid) return;

    try {
      setStep("uploading");

      // 1. Upload photo to IPFS
      const imageCid = await uploadToIPFS(form.photo!);

      // 2. Pin metadata JSON to IPFS
      const metadata = {
        name: form.treeName,
        description: `CNC DAO verified tree submission`,
        image: imageCid,
        attributes: [
          { trait_type: "Height (cm)", value: form.height },
          { trait_type: "Latitude", value: form.latitude },
          { trait_type: "Longitude", value: form.longitude },
          { trait_type: "Project Type", value: form.projectType },
          { trait_type: "Notes", value: form.notes },
          { trait_type: "Submitted By", value: publicKey.toBase58() },
          { trait_type: "Timestamp", value: new Date().toISOString() },
          { trait_type: "Status", value: "pending_verification" },
        ],
      };
      const metadataCid = await pinMetadata(metadata);

      // 3. Build Solana transaction with memo instruction
      setStep("confirming");

      const memoData = JSON.stringify({
        protocol: "CNC_DAO_v1",
        type: "TREE_SUBMISSION",
        cid: metadataCid,
        tree: form.treeName,
        lat: form.latitude,
        lng: form.longitude,
      });

      const transaction = new Transaction().add(
        new TransactionInstruction({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(memoData, "utf-8"),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 4. Send transaction — wallet will prompt user to approve
      const signature = await sendTransaction(transaction, connection);

      // 5. Confirm
      await connection.confirmTransaction(signature, "confirmed");

      setTxSignature(signature);
      setStep("success");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
      setStep("error");
    }
  };

  return (
    <section id="submit" className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Dot grid bg */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(#FFD700 0.5px, transparent 0.5px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-4">On-Chain Registry</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-none">
              SUBMIT<br />
              <span className="text-gold gold-text-glow">YOUR TREE.</span>
            </h2>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
              Plant a tree, photograph it, submit it on-chain. Once 2 Nature Heroes verify it, your NFT is minted.
            </p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0d0d0d] border border-white/8 rounded-3xl overflow-hidden"
        >
          <AnimatePresence mode="wait">

            {/* ── FORM STATE ── */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid lg:grid-cols-2 gap-0"
              >
                {/* Left — inputs */}
                <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/5 space-y-5">

                  {/* Tree Name */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">
                      <TreePine size={10} className="text-gold" /> Tree Name / Species
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. White Oak, Moringa..."
                      value={form.treeName}
                      onChange={e => setForm(f => ({ ...f, treeName: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">
                      <Ruler size={10} className="text-gold" /> Height (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={form.height}
                      onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>

                  {/* GPS */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
                        <MapPin size={10} className="text-gold" /> GPS Coordinates
                      </label>
                      <button
                        onClick={getGPS}
                        className="text-[9px] font-black uppercase tracking-widest text-gold/60 hover:text-gold transition-colors"
                      >
                        Auto-detect →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Latitude"
                        value={form.latitude}
                        onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Longitude"
                        value={form.longitude}
                        onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-2 block">
                      Project Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["single", "combined"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setForm(f => ({ ...f, projectType: type }))}
                          className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            form.projectType === type
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-white/10 text-white/30 hover:border-white/20"
                          }`}
                        >
                          {type} Project
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-2 block">
                      Notes (optional)
                    </label>
                    <textarea
                      placeholder="Any additional details about this planting..."
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      rows={3}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Right — photo upload + submit */}
                <div className="p-8 md:p-10 flex flex-col gap-5">
                  {/* Photo Upload */}
                  <div>
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">
                      <Camera size={10} className="text-gold" /> Tree Photo (required)
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      className={`relative w-full aspect-video rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden flex items-center justify-center ${
                        dragOver ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/30 bg-black/40"
                      }`}
                    >
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); setPhotoPreview(null); setForm(f => ({ ...f, photo: null })); }}
                            className="absolute top-3 right-3 bg-black/70 rounded-full w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <Upload size={24} className="text-gold/30 mx-auto mb-3" />
                          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Drop photo here</p>
                          <p className="text-white/15 text-[9px] mt-1">or click to browse</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => { if (e.target.files?.[0]) handlePhoto(e.target.files[0]); }}
                    />
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 mt-auto">
                    {[
                      { label: "Tree name entered", done: !!form.treeName },
                      { label: "Height recorded", done: !!form.height },
                      { label: "GPS coordinates set", done: !!(form.latitude && form.longitude) },
                      { label: "Photo attached", done: !!form.photo },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          item.done ? "border-gold bg-gold/10" : "border-white/10"
                        }`}>
                          {item.done && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          item.done ? "text-white/60" : "text-white/20"
                        }`}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`w-full group flex items-center justify-between pl-7 pr-2 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                      isValid
                        ? "bg-gold text-black hover:gap-2 cursor-pointer"
                        : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                    }`}
                  >
                    {connected ? "Submit Tree On-Chain" : "Connect Wallet to Submit"}
                    <span className={`rounded-full w-10 h-10 flex items-center justify-center transition-transform ${
                      isValid ? "bg-black group-hover:scale-110" : "bg-white/5"
                    }`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke={isValid ? "#FFD700" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>

                  <p className="text-white/15 text-[9px] text-center font-bold uppercase tracking-widest">
                    Photo stored on IPFS · Data anchored on Solana
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── UPLOADING STATE ── */}
            {step === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6"
              >
                <Loader2 size={40} className="text-gold animate-spin" />
                <div className="text-center">
                  <p className="font-display text-3xl text-white mb-2">UPLOADING TO IPFS</p>
                  <p className="text-white/30 text-xs uppercase tracking-widest">Pinning your photo and metadata to the decentralized web...</p>
                </div>
              </motion.div>
            )}

            {/* ── CONFIRMING STATE ── */}
            {step === "confirming" && (
              <motion.div
                key="confirming"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6"
              >
                <Loader2 size={40} className="text-gold animate-spin" />
                <div className="text-center">
                  <p className="font-display text-3xl text-white mb-2">CONFIRM IN WALLET</p>
                  <p className="text-white/30 text-xs uppercase tracking-widest">Approve the transaction in your Solana wallet to anchor this tree on-chain.</p>
                </div>
              </motion.div>
            )}

            {/* ── SUCCESS STATE ── */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <CheckCircle size={32} className="text-gold" />
                </div>
                <div>
                  <p className="font-display text-4xl text-white mb-2">TREE SUBMITTED!</p>
                  <p className="text-white/40 text-sm max-w-md">
                    Your tree is now pending verification by 2 Nature Heroes. Once approved it will be anchored on Solana and eligible for NFT minting.
                  </p>
                </div>
                <a
                  href={`https://solscan.io/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  View on Solscan →
                </a>
                <button
                  onClick={() => {
                    setStep("form");
                    setForm({ treeName: "", height: "", latitude: "", longitude: "", projectType: "single", notes: "", photo: null });
                    setPhotoPreview(null);
                    setTxSignature("");
                  }}
                  className="border border-white/10 text-white/40 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-gold/30 hover:text-gold transition-all"
                >
                  Submit Another Tree
                </button>
              </motion.div>
            )}

            {/* ── ERROR STATE ── */}
            {step === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-400" />
                </div>
                <div>
                  <p className="font-display text-4xl text-white mb-2">SUBMISSION FAILED</p>
                  <p className="text-white/40 text-sm max-w-md">{errorMsg}</p>
                </div>
                <button
                  onClick={() => { setStep("form"); setErrorMsg(""); }}
                  className="bg-gold text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                >
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
