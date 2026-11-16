import Link from "next/link";
import { 
  DownloadCloud, 
  Monitor, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  CheckCircle2,
  HardDrive
} from "lucide-react";

export default function DownloadPage() {
  const downloadUrl = "https://drive.usercontent.google.com/download?id=1SbOZ9wmNcN6EhIcl3EsU-_TvL0BQTOUe&export=download&authuser=0&confirm=t";
  const mirrorUrl = "https://drive.google.com/file/d/1SbOZ9wmNcN6EhIcl3EsU-_TvL0BQTOUe/view?usp=sharing";

  return (
    <main className="bg-[#07090E] text-slate-100 min-h-screen relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200 py-20">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-[650px] h-[650px] bg-gradient-to-br from-cyan-500/20 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>OFFIZIELLER DESKTOP CLIENT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            LearnLock für Windows
          </h1>

          <p className="text-lg text-slate-400">
            Die Installation dauert weniger als 2 Minuten und schützt den gesamten Computer.
          </p>
        </div>

        {/* Windows Download Card Focused (Mac and Linux removed as requested) */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="rounded-3xl backdrop-blur-2xl p-8 sm:p-10 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.25)] bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-2 border-cyan-400/50">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-white">⊞</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Empfohlen
                </span>
              </div>

              <h3 className="text-3xl font-bold text-white mb-1">Windows 10 / 11</h3>
              <p className="text-sm text-slate-400 mb-8">64-Bit Desktop Edition • Vollversion</p>

              <div className="space-y-4">
                <a
                  href={downloadUrl}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
                >
                  <DownloadCloud className="w-5 h-5" />
                  Setup Installer herunterladen (.exe)
                </a>

                <a
                  href={mirrorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-medium text-xs border border-white/10 flex items-center justify-center gap-2 transition"
                >
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  Google Drive Datei-Vorschau öffnen
                </a>
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-white/[0.08] text-xs text-slate-400 leading-relaxed text-center">
              Inklusive UAC Admin-Schutz, kindersicherer App-Sperre &amp; automatischer Synchronisierung.
            </div>
          </div>
        </div>

        {/* 3 Step Install Guide */}
        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            In 3 einfachen Schritten startklar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-bold flex items-center justify-center text-sm">
                1
              </span>
              <h4 className="font-bold text-white text-sm">Setup ausführen</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Starte den Installer und richte LearnLock in wenigen Sekunden auf deinem PC ein.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 font-bold flex items-center justify-center text-sm">
                2
              </span>
              <h4 className="font-bold text-white text-sm">Elternkonto festlegen</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Einmalig Admin-Passwort vergeben. Kinderprofile und Fächer auswählen.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                3
              </span>
              <h4 className="font-bold text-white text-sm">Fertig &amp; Geschützt</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spiele und Apps werden erst nach erledigten Lernaufgaben freigeschaltet.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
