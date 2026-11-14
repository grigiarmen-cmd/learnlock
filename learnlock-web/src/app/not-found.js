import Link from "next/link";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#07090E] text-slate-100 flex items-center justify-center relative overflow-hidden font-sans p-6 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Liquid Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Liquid Glass Card */}
      <div className="relative z-10 max-w-lg w-full rounded-[36px] bg-[#0C1019]/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 text-center shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-6">
        
        {/* Glowing Lock Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-400/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.35)]">
          <Lock className="w-10 h-10 text-cyan-400" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20">
            Fehler 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Seite nicht gefunden
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            Diese Seite existiert nicht oder wurde verschoben. Keine Sorge, deine Sicherheitseinstellungen und Profile sind aktiv.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Zur Startseite
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-semibold text-sm border border-white/10 transition"
          >
            Zum Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}
