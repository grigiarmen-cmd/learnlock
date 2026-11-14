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
  const platforms = [
    {
      os: "Windows",
      badge: "Empfohlen",
      version: "Windows 10 / 11 (64-bit)",
      icon: "⊞",
      primaryDownload: "/download/LearnLock-Setup.exe",
      primaryLabel: "Setup Installer (.exe)",
      secondaryDownload: "/download/LearnLock-Portable.zip",
      secondaryLabel: "Portable (.zip)",
      note: "Inklusive UAC Admin-Schutz & automatischer Multi-User Windows Synchronisierung."
    },
    {
      os: "macOS",
      badge: "Universal",
      version: "macOS 12+ (Monterey, Sonoma, Sequoia)",
      icon: "",
      primaryDownload: "#",
      primaryLabel: "Apple Silicon & Intel (.dmg)",
      secondaryDownload: "#",
      secondaryLabel: "Homebrew Cask",
      note: "Native Apple Silicon (M1/M2/M3/M4) Optimierung mit Screen Time Integration."
    },
    {
      os: "Linux",
      badge: "Open Source Ready",
      version: "Ubuntu, Debian, Fedora, Arch",
      icon: "🐧",
      primaryDownload: "#",
      primaryLabel: "AppImage Universal",
      secondaryDownload: "#",
      secondaryLabel: "Debian Package (.deb)",
      note: "Systemd Service Daemon mit X11 & Wayland App-Fokus Überwachung."
    }
  ];

  return (
    <main className="bg-[#07090E] text-slate-100 min-h-screen relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200 py-20">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-[650px] h-[650px] bg-gradient-to-br from-cyan-500/20 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>CROSS-PLATFORM DESKTOP CLIENT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            LearnLock für Desktop
          </h1>

          <p className="text-lg text-slate-400">
            Wähle dein Betriebssystem. Die Installation dauert weniger als 2 Minuten und schützt den gesamten Computer.
          </p>
        </div>

        {/* 3 OS Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {platforms.map((p, idx) => (
            <div 
              key={idx}
              className={`rounded-3xl backdrop-blur-2xl p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${
                p.os === "Windows"
                  ? "bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.2)]"
                  : "bg-white/[0.04] border border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-white">{p.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{p.os}</h3>
                <p className="text-xs text-slate-400 mb-6">{p.version}</p>

                <div className="space-y-3">
                  <a
                    href={p.primaryDownload}
                    download={p.os === "Windows" ? "LearnLock-Setup.exe" : undefined}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    {p.primaryLabel}
                  </a>

                  <a
                    href={p.secondaryDownload}
                    download={p.os === "Windows" ? "LearnLock-Portable.zip" : undefined}
                    className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-medium text-xs border border-white/5 flex items-center justify-center gap-2 transition"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    {p.secondaryLabel}
                  </a>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] text-slate-400 leading-relaxed">
                {p.note}
              </div>
            </div>
          ))}
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
                Starte den Installer und wähle die gewünschten Benutzerkonten (z.B. Tom, Max) aus.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 font-bold flex items-center justify-center text-sm">
                2
              </span>
              <h4 className="font-bold text-white text-sm">Elternkonto festlegen</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Einmalig Admin-Passwort vergeben. Alle Windows-Accounts werden automatisch synchronisiert.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                3
              </span>
              <h4 className="font-bold text-white text-sm">Fertig & Geschützt</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spiele werden erst nach erledigten Lernaufgaben freigeschaltet.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
