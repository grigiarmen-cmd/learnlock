import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  EyeOff, 
  FileCheck2, 
  Cpu, 
  Database, 
  Terminal,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="bg-[#07090E] text-slate-100 min-h-screen relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200 py-20">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>ENTERPRISE GRADE PARENTAL PROTECTION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Sicherheit & Privatsphäre <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              ohne Kompromisse.
            </span>
          </h1>

          <p className="text-lg text-slate-400">
            LearnLock wurde nach dem Prinzip &bdquo;Privacy First&ldquo; entwickelt. Alle Lerndaten und Zeitprotokolle verbleiben standardmäßig verschlüsselt auf dem lokalen Gerät.
          </p>
        </div>

        {/* 4 Core Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Manipulationssicherer Windows Service</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kinder können LearnLock weder über den Windows Task-Manager beenden noch über den Explorer löschen. Der Watchdog-Service wird mit SYSTEM-Privilegien ausgeführt und schützt sich selbst.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">PBKDF2 Eltern-PIN Verschlüsselung</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Elternpasswörter und Admin-PINs werden nicht im Klartext gespeichert. Wir verwenden modernste PBKDF2-Hash-Verfahren mit SHA-256 und kryptografischem Salt gegen Brute-Force-Angriffe.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Lokale Datenhoheit (100% DSGVO)</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kein heimliches Tracking, keine Bildschirmaufnahmen ins Internet. Alle Aufgaben und Zeitguthaben werden in einer lokalen SQLite-Datenbank auf deinem Rechner gepflegt.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Kernel & Hosts-Ebene Web-Filter</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Der Web-Filter blockiert unerwünschte Webseiten unabhängig vom verwendeten Browser (Chrome, Edge, Firefox, Brave) direkt auf Netzwerkebene und verhindert VPN-Umgehungen.
            </p>
          </div>

        </div>

        {/* Security Checklist */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            LearnLock Sicherheitsversprechen
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Kein Verkauf von Kinder- oder Nutzerdaten
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Keine versteckte Third-Party-Werbung
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              UAC-Admin Abfrage bei Setup & Konfiguration
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Multi-User Windows Isolierung
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
