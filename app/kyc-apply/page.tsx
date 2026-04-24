"use client";
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, User, Mail, Phone, Globe,
  Upload, Camera, Shield, CheckCircle, Loader2, AlertCircle, X
} from 'lucide-react';
import Navbar from '@/components/Navbar';

type Stage = 'wallet' | 'personal' | 'document' | 'selfie' | 'review' | 'submitting' | 'success' | 'error';

interface KYCForm {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  idType: 'passport' | 'national_id' | 'drivers_license';
  idNumber: string;
  idFront: File | null;
  idBack: File | null;
  selfie: File | null;
  agreedToTerms: boolean;
}

const COUNTRIES = [
  'Nigeria','Ghana','Kenya','South Africa','Ethiopia','Tanzania','Uganda','Rwanda',
  'United States','United Kingdom','Canada','Australia','Germany','France',
  'Brazil','India','Indonesia','Philippines','Mexico','Colombia',
];

const ID_TYPES = [
  { value: 'passport',         label: 'International Passport' },
  { value: 'national_id',      label: 'National ID Card' },
  { value: 'drivers_license',  label: "Driver's License" },
];

const STAGES: Stage[] = ['wallet','personal','document','selfie','review'];
const STAGE_LABELS = ['Wallet','Personal Info','ID Document','Selfie','Review'];

export default function KYCApplyPage() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [stage, setStage] = useState<Stage>('wallet');
  const [errMsg, setErrMsg] = useState('');

  const [form, setForm] = useState<KYCForm>({
    fullName:'', email:'', phone:'', country:'', dateOfBirth:'',
    idType:'passport', idNumber:'',
    idFront:null, idBack:null, selfie:null,
    agreedToTerms:false,
  });

  const [idFrontPreview, setIdFrontPreview] = useState<string|null>(null);
  const [idBackPreview,  setIdBackPreview]  = useState<string|null>(null);
  const [selfiePreview,  setSelfiePreview]  = useState<string|null>(null);

  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef  = useRef<HTMLInputElement>(null);
  const selfieRef  = useRef<HTMLInputElement>(null);

  const setFile = (field: 'idFront'|'idBack'|'selfie', file: File) => {
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, [field]: file }));
    if (field === 'idFront') setIdFrontPreview(url);
    if (field === 'idBack')  setIdBackPreview(url);
    if (field === 'selfie')  setSelfiePreview(url);
  };

  const stageIndex = STAGES.indexOf(stage as any);

  const goNext = () => {
    const idx = STAGES.indexOf(stage as any);
    if (idx < STAGES.length - 1) setStage(STAGES[idx + 1]);
  };
  const goBack = () => {
    const idx = STAGES.indexOf(stage as any);
    if (idx > 0) setStage(STAGES[idx - 1]);
  };

  const handleSubmit = async () => {
    setStage('submitting');
    try {
      // Simulate KYC submission — replace with real API call
      await new Promise(r => setTimeout(r, 2500));
      // In production: POST to your KYC API with form data + wallet address
      setStage('success');
    } catch (e: any) {
      setErrMsg(e?.message || 'Submission failed. Please try again.');
      setStage('error');
    }
  };

  // Progress bar width
  const progress = stageIndex >= 0 ? ((stageIndex) / (STAGES.length - 1)) * 100 : 0;

  return (
    <main className="min-h-screen" style={{ background:'var(--bg)' }}>
      <Navbar />

      <div className="pt-36 pb-20 px-6 max-w-3xl mx-auto">

        {/* Back */}
        <Link href="/kyc"
          className="inline-flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-widest transition-all group th-ghost hover:text-gold"
        >
          <span className="w-8 h-8 rounded-full flex items-center justify-center border transition-all group-hover:border-gold/40 th-border">
            <ArrowLeft size={13} />
          </span>
          Back to KYC Info
        </Link>

        {/* Header */}
        <div className="text-gold text-[9px] font-black uppercase tracking-[0.35em] mb-3">KYC Application</div>
        <h1 className="font-display text-5xl md:text-6xl leading-none mb-10 th-text">
          APPLY AS A<br /><span className="text-gold gold-text-glow">NATURE HERO.</span>
        </h1>

        {/* Progress steps — only shown during form stages */}
        {['wallet','personal','document','selfie','review'].includes(stage) && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              {STAGE_LABELS.map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black transition-all"
                    style={{
                      background: i <= stageIndex ? 'var(--gold)' : 'var(--bg-card)',
                      color:      i <= stageIndex ? 'var(--on-gold)' : 'var(--text-ghost)',
                      border:     `1px solid ${i <= stageIndex ? 'var(--gold)' : 'var(--border)'}`,
                    }}>
                    {i < stageIndex ? '✓' : i + 1}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider hidden sm:block"
                    style={{ color: i <= stageIndex ? 'var(--gold)' : 'var(--text-ghost)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="h-0.5 rounded-full" style={{ background:'var(--border)' }}>
              <div className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="rounded-3xl overflow-hidden th-card" style={{ border:'1px solid var(--border)' }}>
          <AnimatePresence mode="wait">

            {/* ── STAGE 1: WALLET ── */}
            {stage === 'wallet' && (
              <motion.div key="wallet" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold"
                    style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h2 className="font-black uppercase text-sm th-text">Connect Your Wallet</h2>
                    <p className="text-[10px] th-faint">Your wallet is your on-chain identity</p>
                  </div>
                </div>

                {connected && publicKey ? (
                  <div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl mb-6"
                      style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.2)' }}>
                      <CheckCircle size={18} className="text-green-400 shrink-0" />
                      <div>
                        <p className="text-green-400 font-black text-xs uppercase tracking-widest">Wallet Connected</p>
                        <p className="text-[10px] font-mono mt-0.5 th-dim">{publicKey.toBase58()}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed mb-8 th-dim">
                      Your KYC will be permanently linked to this Solana wallet address. Make sure this is the wallet you intend to use for CNC DAO.
                    </p>
                    <button onClick={goNext}
                      className="group inline-flex items-center gap-3 pl-7 pr-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
                      style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                      Continue to Personal Info
                      <span className="rounded-full w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background:'var(--on-gold)' }}>
                        <ArrowRight size={14} style={{ color:'var(--gold)' }} />
                      </span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm leading-relaxed mb-8 th-dim">
                      Connect your Solana wallet to begin. Your wallet address will be permanently linked to your verified identity on-chain.
                    </p>
                    <button onClick={() => setVisible(true)}
                      className="group inline-flex items-center gap-3 pl-7 pr-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all"
                      style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                      Connect Wallet
                      <span className="rounded-full w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background:'var(--on-gold)' }}>
                        <ArrowRight size={14} style={{ color:'var(--gold)' }} />
                      </span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STAGE 2: PERSONAL INFO ── */}
            {stage === 'personal' && (
              <motion.div key="personal" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold"
                    style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="font-black uppercase text-sm th-text">Personal Information</h2>
                    <p className="text-[10px] th-faint">All fields are required</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">Full Legal Name</label>
                    <input type="text" placeholder="As it appears on your ID"
                      value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName:e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                      style={{ border:'1px solid var(--border)' }}
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">
                        <Mail size={9} className="inline mr-1" />Email Address
                      </label>
                      <input type="email" placeholder="you@example.com"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                        style={{ border:'1px solid var(--border)' }}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">
                        <Phone size={9} className="inline mr-1" />Phone Number
                      </label>
                      <input type="tel" placeholder="+234 800 000 0000"
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone:e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                        style={{ border:'1px solid var(--border)' }}
                      />
                    </div>
                  </div>

                  {/* Country + DOB */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">
                        <Globe size={9} className="inline mr-1" />Country of Residence
                      </label>
                      <select value={form.country} onChange={e => setForm(f => ({ ...f, country:e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                        style={{ border:'1px solid var(--border)' }}>
                        <option value="">Select country…</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">Date of Birth</label>
                      <input type="date"
                        value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth:e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                        style={{ border:'1px solid var(--border)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between mt-8">
                  <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest th-faint hover:text-gold transition-colors">
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button onClick={goNext}
                    disabled={!form.fullName || !form.email || !form.phone || !form.country || !form.dateOfBirth}
                    className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                    style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                    Continue
                    <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background:'var(--on-gold)' }}>
                      <ArrowRight size={13} style={{ color:'var(--gold)' }} />
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STAGE 3: ID DOCUMENT ── */}
            {stage === 'document' && (
              <motion.div key="document" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold"
                    style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h2 className="font-black uppercase text-sm th-text">ID Document</h2>
                    <p className="text-[10px] th-faint">Upload clear photos of your government-issued ID</p>
                  </div>
                </div>

                {/* ID Type */}
                <div className="mb-6">
                  <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-3 block th-faint">Document Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {ID_TYPES.map(t => (
                      <button key={t.value} onClick={() => setForm(f => ({ ...f, idType: t.value as any }))}
                        className="py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all text-center"
                        style={{
                          border:`1px solid ${form.idType === t.value ? 'var(--gold)' : 'var(--border)'}`,
                          background: form.idType === t.value ? 'var(--gold-dim)' : 'transparent',
                          color: form.idType === t.value ? 'var(--gold)' : 'var(--text-faint)',
                        }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ID Number */}
                <div className="mb-6">
                  <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">Document Number</label>
                  <input type="text" placeholder="Enter document number"
                    value={form.idNumber} onChange={e => setForm(f => ({ ...f, idNumber:e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none th-input"
                    style={{ border:'1px solid var(--border)' }}
                  />
                </div>

                {/* Front + Back uploads */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { label:'Front of ID', preview:idFrontPreview, ref:idFrontRef, field:'idFront' as const },
                    { label:'Back of ID',  preview:idBackPreview,  ref:idBackRef,  field:'idBack' as const },
                  ].map(item => (
                    <div key={item.label}>
                      <label className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 block th-faint">{item.label}</label>
                      <div onClick={() => item.ref.current?.click()}
                        className="relative aspect-[3/2] rounded-xl cursor-pointer overflow-hidden flex items-center justify-center transition-all"
                        style={{ border:`2px dashed var(--border)`, background:'var(--bg)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      >
                        {item.preview ? (
                          <>
                            <img src={item.preview} alt={item.label} className="absolute inset-0 w-full h-full object-cover" />
                            <button onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, [item.field]:null })); if(item.field==='idFront') setIdFrontPreview(null); if(item.field==='idBack') setIdBackPreview(null); }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background:'rgba(0,0,0,0.7)' }}>
                              <X size={10} className="text-white" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <Upload size={20} className="mx-auto mb-2" style={{ color:'var(--gold)', opacity:0.4 }} />
                            <p className="text-[9px] font-bold uppercase tracking-widest th-ghost">Tap to upload</p>
                          </div>
                        )}
                      </div>
                      <input ref={item.ref} type="file" accept="image/*" capture="environment" className="hidden"
                        onChange={e => { if (e.target.files?.[0]) setFile(item.field, e.target.files[0]); }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest th-faint hover:text-gold transition-colors">
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button onClick={goNext}
                    disabled={!form.idNumber || !form.idFront || !form.idBack}
                    className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                    style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                    Continue
                    <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background:'var(--on-gold)' }}>
                      <ArrowRight size={13} style={{ color:'var(--gold)' }} />
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STAGE 4: SELFIE ── */}
            {stage === 'selfie' && (
              <motion.div key="selfie" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold"
                    style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                    <Camera size={18} />
                  </div>
                  <div>
                    <h2 className="font-black uppercase text-sm th-text">Liveness Check</h2>
                    <p className="text-[10px] th-faint">Take a clear selfie holding your ID</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="rounded-2xl p-5 mb-6" style={{ background:'var(--bg)', border:'1px solid var(--border)' }}>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gold mb-3">Instructions</p>
                  {['Hold your ID clearly next to your face','Make sure your face is fully visible and well lit','No glasses or hats','Photo must be taken in a well-lit environment'].map(tip => (
                    <div key={tip} className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-1 rounded-full bg-gold shrink-0" />
                      <p className="text-xs th-dim">{tip}</p>
                    </div>
                  ))}
                </div>

                {/* Selfie upload */}
                <div className="mb-8">
                  <div onClick={() => selfieRef.current?.click()}
                    className="relative w-full aspect-video rounded-2xl cursor-pointer overflow-hidden flex items-center justify-center transition-all"
                    style={{ border:`2px dashed var(--border)`, background:'var(--bg)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    {selfiePreview ? (
                      <>
                        <img src={selfiePreview} alt="Selfie" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          style={{ background:'rgba(0,0,0,0.5)' }}>
                          <p className="text-white text-[10px] font-black uppercase tracking-widest">Retake Photo</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setSelfiePreview(null); setForm(f => ({ ...f, selfie:null })); }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background:'rgba(0,0,0,0.7)' }}>
                          <X size={12} className="text-white" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-8">
                        <Camera size={32} className="mx-auto mb-3" style={{ color:'var(--gold)', opacity:0.3 }} />
                        <p className="text-[10px] font-bold uppercase tracking-widest th-ghost">Tap to take selfie with ID</p>
                        <p className="text-[9px] mt-1 th-ghost">Opens camera on mobile</p>
                      </div>
                    )}
                  </div>
                  <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) setFile('selfie', e.target.files[0]); }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest th-faint hover:text-gold transition-colors">
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button onClick={goNext} disabled={!form.selfie}
                    className="group inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                    style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                    Continue
                    <span className="rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background:'var(--on-gold)' }}>
                      <ArrowRight size={13} style={{ color:'var(--gold)' }} />
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STAGE 5: REVIEW ── */}
            {stage === 'review' && (
              <motion.div key="review" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
                className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold"
                    style={{ background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <h2 className="font-black uppercase text-sm th-text">Review & Submit</h2>
                    <p className="text-[10px] th-faint">Check everything before submitting</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3 mb-8">
                  {[
                    { label:'Wallet',       value: publicKey ? `${publicKey.toBase58().slice(0,8)}…${publicKey.toBase58().slice(-6)}` : '—' },
                    { label:'Full Name',    value: form.fullName },
                    { label:'Email',        value: form.email },
                    { label:'Phone',        value: form.phone },
                    { label:'Country',      value: form.country },
                    { label:'Date of Birth',value: form.dateOfBirth },
                    { label:'ID Type',      value: ID_TYPES.find(t => t.value === form.idType)?.label || '' },
                    { label:'ID Number',    value: form.idNumber },
                    { label:'ID Photos',    value: form.idFront && form.idBack ? '✓ Front & Back uploaded' : '—' },
                    { label:'Selfie',       value: form.selfie ? '✓ Uploaded' : '—' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-3 px-4 rounded-xl"
                      style={{ background:'var(--bg)', border:'1px solid var(--border)' }}>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] th-ghost">{row.label}</span>
                      <span className="text-xs font-semibold th-sec">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 mb-8 p-4 rounded-xl"
                  style={{ background:'var(--bg)', border:'1px solid var(--border)' }}>
                  <button onClick={() => setForm(f => ({ ...f, agreedToTerms: !f.agreedToTerms }))}
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-all"
                    style={{
                      background: form.agreedToTerms ? 'var(--gold)' : 'transparent',
                      border: `2px solid ${form.agreedToTerms ? 'var(--gold)' : 'var(--border)'}`,
                    }}>
                    {form.agreedToTerms && <CheckCircle size={12} style={{ color:'var(--on-gold)' }} />}
                  </button>
                  <p className="text-xs leading-relaxed th-dim">
                    I confirm that all information provided is accurate. I understand that false information will result in permanent disqualification from CNC DAO.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest th-faint hover:text-gold transition-colors">
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button onClick={handleSubmit} disabled={!form.agreedToTerms}
                    className="group inline-flex items-center gap-3 pl-7 pr-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40 hover:gap-4"
                    style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                    Submit KYC Application
                    <span className="rounded-full w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background:'var(--on-gold)' }}>
                      <ArrowRight size={14} style={{ color:'var(--gold)' }} />
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── SUBMITTING ── */}
            {stage === 'submitting' && (
              <motion.div key="submitting" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <Loader2 size={40} className="text-gold animate-spin" />
                <div>
                  <p className="font-display text-3xl mb-2 th-text">SUBMITTING APPLICATION</p>
                  <p className="text-xs uppercase tracking-widest th-faint">Verifying your documents and securing your identity on-chain…</p>
                </div>
              </motion.div>
            )}

            {/* ── SUCCESS ── */}
            {stage === 'success' && (
              <motion.div key="success" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background:'var(--gold-dim)', border:'2px solid var(--gold)' }}>
                  <CheckCircle size={40} className="text-gold" />
                </div>
                <div>
                  <p className="font-display text-5xl mb-3 th-text">APPLICATION SUBMITTED!</p>
                  <p className="text-sm max-w-sm leading-relaxed th-dim">
                    Your KYC application is under review. You will receive an email at <strong className="th-text">{form.email}</strong> within 24–48 hours once approved.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Link href="/"
                    className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                    style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                    Back to Home
                  </Link>
                  <Link href="/impact-map"
                    className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all th-dim hover:text-gold"
                    style={{ border:'1px solid var(--border)' }}>
                    View Impact Map
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── ERROR ── */}
            {stage === 'error' && (
              <motion.div key="error" initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="flex flex-col items-center justify-center py-24 px-10 gap-6 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)' }}>
                  <AlertCircle size={32} className="text-red-400" />
                </div>
                <div>
                  <p className="font-display text-3xl mb-2 th-text">SUBMISSION FAILED</p>
                  <p className="text-sm th-dim">{errMsg}</p>
                </div>
                <button onClick={() => setStage('review')}
                  className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                  style={{ background:'var(--gold)', color:'var(--on-gold)' }}>
                  Try Again
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
