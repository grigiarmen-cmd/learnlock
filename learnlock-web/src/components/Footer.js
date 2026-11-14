"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="border-t border-white/[0.08] bg-[#07090E] text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Learn<span className="text-cyan-400">lock</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Desktop-only workspace & smart parental lock. Fokus sichern, Aufgaben meistern, Bildschirmzeit verdienen.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wider uppercase">Produkt</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/features" className="hover:text-cyan-400 transition">Features</Link></li>
              <li><Link href="/security" className="hover:text-cyan-400 transition">Security</Link></li>
              <li><Link href="/release-notes" className="hover:text-cyan-400 transition">Release Notes</Link></li>
              <li><Link href="/download" className="hover:text-cyan-400 transition">Download für Desktop</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 transition">Preise (Lifetime & Abo)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wider uppercase">Plattformen</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/download" className="hover:text-cyan-400 transition">Windows 10 / 11 (64-bit)</Link></li>
              <li><Link href="/download" className="hover:text-cyan-400 transition">macOS (Apple Silicon & Intel)</Link></li>
              <li><Link href="/download" className="hover:text-cyan-400 transition">Linux (.deb & AppImage)</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition">Web Dashboard (Cloud Sync)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wider uppercase">Rechtliches</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-500">DSGVO & Lokale Datenhaltung</span></li>
              <li><span className="text-slate-500">Impressum</span></li>
              <li><span className="text-slate-500">AGB & Widerruf</span></li>
              <li><span className="text-slate-500">Sicherheitszertifikat</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/[0.08] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LearnLock Technologies Inc. Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Systeme betriebsbereit & sicher
          </p>
        </div>
      </div>
    </footer>
  );
}
