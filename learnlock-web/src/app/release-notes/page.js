import Link from "next/link";
import { Sparkles, Terminal, CheckCircle2, ArrowRight, DownloadCloud, ShieldCheck, Zap } from "lucide-react";

export default function ReleaseNotesPage() {
  const releases = [
    {
      version: "v2.4.0 (Latest)",
      date: "14. November 2026",
      tag: "Major Update",
      title: "Liquid Glass Redesign, Multi-User Windows Setup & Cross-Platform Engine",
      highlights: [
        "Neues Liquid Glass Dark UI mit Echtzeit-Glow-Gradients und MacOS-Optik.",
        "Multi-User Windows Installer mit UAC-Admin Abfrage und Benutzer-Auswahl (z.B. Tom, Luc, Max).",
        "Zentraler ProgramData Sync: Einmalige Eltern-Anmeldung synchronisiert automatisch alle Profile.",
        "Vertikaler Scrollviewer für den Fächer-Dialog (Mathe, Deutsch, Englisch, Bio, Chemie, etc.).",
        "Neues Preismodell: 0 € Free (1 Profil), 100 €/Jahr (Alle Features), 250 € Lifetime (Einmalig lebenslänglich).",
        "Avatar-Upload & Presets für Kinderprofile direkt im Web & App Dashboard."
      ]
    },
    {
      version: "v2.2.0",
      date: "01. November 2026",
      tag: "Feature Update",
      title: "Erweiterte KI-Lernfragen & Sofortige App-Blockierung",
      highlights: [
        "KI-gestützte adaptive Mathe- & Grammatikfragen nach Klassenstufen 1 bis 10.",
        "Automatische Schließung blockierter Spiele (Minecraft, Roblox, Fortnite, Steam) in unter 1 Sekunde.",
        "E-Mail Benachrichtigungen für wöchentliche Lernberichte."
      ]
    },
    {
      version: "v2.0.0",
      date: "15. Oktober 2026",
      tag: "Initial Public Release",
      title: "LearnLock Core Engine für Windows 10 & 11",
      highlights: [
        "Systemweiter Windows-Dienst mit Task-Manager Manipulationsschutz.",
        "Belohnungssystem: Aufgaben lösen, um Bildschirmzeit zu verdienen.",
        "Web-Filter auf DNS- und Hosts-Ebene gegen jugendgefährdende Webseiten."
      ]
    }
  ];

  return (
    <main className="bg-[#07090E] text-slate-100 min-h-screen relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200 py-20">
      
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>CHANGELOG & UPDATES</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Release Notes
          </h1>

          <p className="text-slate-400 text-base">
            Alle Neuerungen, Performance-Optimierungen und Sicherheitsupdates von LearnLock im Überblick.
          </p>
        </div>

        {/* Timeline of Releases */}
        <div className="space-y-10">
          {releases.map((rel, idx) => (
            <div 
              key={idx}
              className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-white tracking-tight">{rel.version}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                    {rel.tag}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{rel.date}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-100">{rel.title}</h3>

              <ul className="space-y-2.5">
                {rel.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Download Callout */}
        <div className="text-center mt-16">
          <Link
            href="/download"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-[0_0_30px_rgba(6,182,212,0.5)] transition"
          >
            <DownloadCloud className="w-5 h-5" />
            Neueste Version herunterladen
          </Link>
        </div>

      </div>
    </main>
  );
}
