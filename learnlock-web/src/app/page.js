"use client";

import Link from "next/link";
import { 
  DownloadCloud, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Check, 
  ArrowRight, 
  Play, 
  Sliders, 
  Smile, 
  Award,
  ChevronRight,
  Monitor
} from "lucide-react";

export default function Home() {
  return (
    <main className="bg-[#07090E] text-slate-100 min-h-screen relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Liquid Glass Background Orbs & Lights */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-purple-600/25 via-pink-600/15 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-700/20 via-cyan-500/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Floating 3D Glass Pebbles from reference image */}
      <div className="absolute top-32 right-1/3 w-16 h-16 rounded-3xl bg-gradient-to-br from-white/20 to-transparent backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(56,189,248,0.25)] rotate-45 pointer-events-none hidden lg:block animate-pulse" />
      <div className="absolute top-[420px] left-[48%] w-14 h-14 rounded-full bg-gradient-to-tr from-white/25 via-purple-400/20 to-transparent backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(168,85,247,0.3)] pointer-events-none hidden lg:block" />
      <div className="absolute top-[680px] right-12 w-20 h-20 rounded-3xl bg-gradient-to-bl from-white/20 via-cyan-400/20 to-transparent backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(6,182,212,0.3)] rotate-12 pointer-events-none hidden lg:block" />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-8">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl text-xs font-semibold text-cyan-300 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>DESKTOP-ONLY WORKSPACE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Learnlock / <br />
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Lock in your focus.
              </span> <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(34,211,238,0.4)]">
                Master your mind.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              A gorgeous, immersive desktop-exclusive application designed to block distractions, manage study flows, and elevate your productivity.
            </p>

            {/* Download CTA Button */}
            <div className="space-y-3">
              <Link
                href="/download"
                className="group relative inline-flex items-center justify-between gap-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-400/40 backdrop-blur-xl hover:border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.55)] transition-all duration-300 text-white font-bold text-lg"
              >
                <div className="flex items-center gap-3">
                  <DownloadCloud className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
                  <span>Download for Desktop</span>
                </div>
                {/* Platform Icons */}
                <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-slate-300">
                  <span className="text-base" title="macOS"></span>
                  <span className="text-sm font-bold" title="Windows">⊞</span>
                  <span className="text-xs uppercase font-mono px-1 py-0.5 rounded bg-white/10">Linux</span>
                </div>
              </Link>
              
              <p className="text-xs text-slate-500 flex items-center gap-2 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                Free download for macOS, Windows & Linux
              </p>
            </div>
          </div>

          {/* Right Column: Liquid Glass App Mockup (From Screenshot) */}
          <div className="lg:col-span-6 relative">
            {/* Grid Pattern Behind Mockup */}
            <div className="absolute -inset-4 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] rounded-3xl pointer-events-none" />

            {/* Outer Window Frame */}
            <div className="relative rounded-3xl bg-[#0C1019]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] p-5 overflow-hidden">
              
              {/* Window Controls (Mac Dots) */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Learnlock Client Preview</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Mockup Dashboard Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Circular Study Timer (Centerpiece) */}
                <div className="md:col-span-7 rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col items-center justify-center relative">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">Study Session</p>
                  
                  {/* Glowing Timer Circle */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                      <defs>
                        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="50%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <circle cx="80" cy="80" r="64" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        stroke="url(#heroGradient)"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 64}
                        strokeDashoffset={2 * Math.PI * 64 * 0.3}
                        strokeLinecap="round"
                        fill="transparent"
                        className="shadow-[0_0_20px_#22d3ee]"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <Lock className="w-4 h-4 text-cyan-300 mb-1" />
                      <span className="text-2xl font-extrabold text-white tracking-tight">45:00</span>
                      <span className="text-[10px] text-slate-400">Locked In</span>
                    </div>
                  </div>

                  <div className="mt-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-cyan-300" /> Plan Aktiv
                  </div>
                </div>

                {/* Right Mini Cards */}
                <div className="md:col-span-5 space-y-4">
                  {/* Interactive Progress */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold">Interactive Progress</span>
                      <span className="text-cyan-400 font-bold">40%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full w-[40%]" />
                    </div>
                  </div>

                  {/* Task Lists */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3.5 space-y-2">
                    <p className="text-xs font-semibold text-slate-300">Active Tasks</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">Mathe: Bruchrechnung</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate">Englisch: Vokabeln 4</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Analytics Sparkline */}
                <div className="md:col-span-12 rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white">Live Analytics</p>
                    <p className="text-[11px] text-slate-400">+1.5 Std. Spielzeit freigeschaltet</p>
                  </div>
                  <div className="h-10 w-44">
                    <svg className="w-full h-full" viewBox="0 0 150 40">
                      <path
                        d="M 0 35 Q 30 10, 60 25 T 110 15 T 150 5"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Second Showcase Section (From Image 2: "Volle Kontrolle, spielend leicht") */}
      <section className="relative z-10 py-24 border-t border-white/[0.08] bg-[#07090E]/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Volle Kontrolle, <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                spielend leicht.
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              Die smarte Elternkontrolle für ein gesundes digitales Gleichgewicht. Bildschirmzeit durch Aufgaben verdienen.
            </p>
          </div>

          {/* Interactive Feature Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Feature Card 1: Kinderprofile anlegen & Avatare */}
            <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Kinderprofile anlegen</h3>
                <p className="text-slate-400 text-sm">
                  Wähle liebevolle Avatar-Vorlagen aus oder lade eigene Fotos direkt im Eltern-Dashboard hoch.
                </p>
              </div>

              {/* Profile Avatars Display */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl bg-white/[0.04] border border-cyan-400/40 p-4 flex flex-col items-center text-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-3xl mb-2 shadow-md">
                    👧
                  </div>
                  <span className="text-sm font-bold text-white">Anna</span>
                  <span className="text-[11px] text-slate-400">8 Jahre</span>
                </div>

                <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-4 flex flex-col items-center text-center hover:border-white/20 transition">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-3xl mb-2 shadow-md">
                    👦
                  </div>
                  <span className="text-sm font-bold text-white">Lukas</span>
                  <span className="text-[11px] text-slate-400">11 Jahre</span>
                </div>

                <Link href="/dashboard" className="rounded-2xl bg-white/[0.04] border border-dashed border-white/20 hover:border-cyan-400/60 p-4 flex flex-col items-center justify-center text-center hover:bg-white/[0.06] transition group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 shadow-md mb-2 transition">
                    <span className="text-2xl font-bold">+</span>
                  </div>
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition">Profil anlegen</span>
                  <span className="text-[11px] text-slate-400">Neu hinzufügen</span>
                </Link>
              </div>

              {/* Toggles preview */}
              <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Tägliche Zeitlimits</span>
                  <div className="w-12 h-6 bg-cyan-500 rounded-full p-1 flex justify-end shadow-[0_0_10px_#22d3ee]">
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Automatische App-Sperren</span>
                  <div className="w-12 h-6 bg-purple-500 rounded-full p-1 flex justify-end shadow-[0_0_10px_#a855f7]">
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2: Bildschirmzeit gewinnen */}
            <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold text-amber-300 mb-3">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>MOTIVATION STATT STREIT</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Bildschirmzeit gewinnen</h3>
                <p className="text-slate-400 text-sm">
                  Bildschirmzeit durch Mathe, Deutsch oder Vokabeltraining Schritt für Schritt freischalten.
                </p>
              </div>

              {/* Task Completion Box */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Aufgaben-Status</span>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
                    75% erledigt
                  </span>
                </div>
                
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full w-[75%]" />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>15 Min. Matheaufgaben gelöst</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      +30 Min. Gaming
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Englisch Vokabeltest bestanden</span>
                    </div>
                    <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                      +1 Std. Gaming
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward Callout */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
                <span>Total heute verdient: <strong className="text-white">1:30 Std.</strong></span>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  ⭐ 33 Sterne erhalten
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Multi-Platform Download Banner */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-[36px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-2xl p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden">
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Bereit für stressfreien Bildschirm-Alltag?
            </h2>
            <p className="text-slate-400 text-base">
              Lade LearnLock jetzt für Windows, macOS oder Linux herunter. Die Einrichtung dauert unter 2 Minuten.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/download"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-[0_0_30px_rgba(6,182,212,0.5)] transition flex items-center justify-center gap-2"
              >
                <DownloadCloud className="w-5 h-5" />
                Jetzt herunterladen
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-bold border border-white/10 transition"
              >
                Preise ansehen (ab 0 €)
              </Link>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
