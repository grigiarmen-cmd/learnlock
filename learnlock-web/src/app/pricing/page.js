"use client";

import Link from "next/link";
import { Check, Sparkles, Crown, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" /> Transparente Familien-Preise
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Schutz & Motivation, die sich auszahlen
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Starte kostenlos mit einem Kind oder schalte alle Fächer, KI-Lernassistenz und Schutzfunktionen für die ganze Familie frei.
          </p>
        </div>

        {/* Pricing Cards Grid (Liquid Glass / Modern UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Card 1: Free Tier */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-6 h-6 text-slate-500" />
                <h3 className="text-xl font-bold text-slate-900">Kostenlos</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 min-h-[40px]">
                Ideal zum Ausprobieren für ein einzelnes Kind.
              </p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-slate-900">0 €</span>
                <span className="text-sm text-slate-500">dauerhaft</span>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Enthalten:</p>
                <ul className="space-y-3.5 text-sm text-slate-600">
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>1 Kinderprofil</strong></span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Mathematik-Aufgaben</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bildschirmsperre & Zeitkontingent</span>
                  </li>
                  <li className="flex gap-3 items-center text-slate-400 line-through">
                    <span>Keine weiteren Schulfächer</span>
                  </li>
                  <li className="flex gap-3 items-center text-slate-400 line-through">
                    <span>Keine App-Sperren</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link href="/download" className="block w-full py-3.5 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-sm">
                Kostenlos herunterladen
              </Link>
            </div>
          </div>

          {/* Card 2: 100€ Jährlich */}
          <div className="bg-white border-2 border-blue-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-lg relative">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-slate-900">Premium Jährlich</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 min-h-[40px]">
                Voller Zugriff für die ganze Familie mit allen Fächern &amp; KI.
              </p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-900">100 €</span>
                <span className="text-sm text-slate-500 font-medium">/ Jahr</span>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">Alles freigeschaltet:</p>
                <ul className="space-y-3.5 text-sm text-slate-700">
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span><strong>Unbegrenzte Kinderprofile</strong></span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span><strong>Alle Schulfächer</strong> (Deutsch, Englisch, Bio...)</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Intelligente <strong>App-Sperren &amp; Webfilter</strong></span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span><strong>Locky KI Lern-Tutor</strong></span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Automatische Updates &amp; Support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link href="/login" className="block w-full py-3.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md shadow-blue-500/20 text-sm">
                Jetzt abonnieren
              </Link>
            </div>
          </div>

          {/* Card 3: 250€ Lebenslang (Featured Liquid Glow) */}
          <div className="bg-gradient-to-b from-orange-50/90 to-amber-50/70 border-2 border-orange-500 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-[11px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              Bester Wert
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-slate-900">Lifetime Unlimited</h3>
              </div>
              <p className="text-sm text-amber-900/80 mb-6 min-h-[40px]">
                Einmalige Zahlung. Lebenslanger Schutz ohne wiederkehrende Abo-Kosten.
              </p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-900">250 €</span>
                <span className="text-sm text-orange-600 font-bold ml-1">einmalig</span>
              </div>

              <div className="border-t border-orange-200/60 pt-6">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-4">Komplett-Paket für immer:</p>
                <ul className="space-y-3.5 text-sm text-slate-800">
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span><strong>Lebenslanger Zugriff</strong> – Nie wieder zahlen</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span><strong>Unbegrenzte Kinder &amp; Geräte</strong></span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Alle jetzigen &amp; zukünftigen Fächer</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Locky KI Lern-Tutor dauerhaft inklusive</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Höchste Priorität bei Support &amp; Updates</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link href="/login" className="block w-full py-4 text-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-xl transition shadow-lg shadow-orange-500/30 text-sm">
                Lebenslang sichern
              </Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
