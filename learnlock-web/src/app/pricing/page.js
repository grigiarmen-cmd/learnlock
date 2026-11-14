import Link from "next/link";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Infinity as InfinityIcon
} from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      tagline: "Perfekt zum Kennenlernen",
      price: "0 €",
      period: "Dauerhaft kostenlos",
      description: "Alle Grundfunktionen für ein einzelnes Kind auf einem PC.",
      features: [
        "1 Kinderprofil inklusive",
        "Bis zu 2 Lernfächer (z.B. Mathe & Deutsch)",
        "Automatische App-Sperren (Minecraft, Roblox, etc.)",
        "Basis Web-Filter auf DNS-Ebene",
        "Lokale Zeitkontrolle"
      ],
      ctaText: "Kostenlos starten",
      ctaHref: "/download",
      popular: false,
      glow: "border-white/10"
    },
    {
      name: "Pro (Jährlich)",
      tagline: "Maximale Flexibilität für Familien",
      price: "100 €",
      period: "pro Jahr (ca. 8,33 € / Monat)",
      description: "Voller Zugriff auf alle Fächer, unbegrenzte Profile und KI-Lernmodi.",
      features: [
        "Unbegrenzte Kinderprofile",
        "Alle Fächer & Klassenstufen (1 - 10)",
        "Multi-User Windows Synchronisierung",
        "Avatar-Upload & Presets",
        "Locky KI-Tutor & Aufgaben-Generator",
        "Erweiterte Web- & URL-Filter",
        "Detaillierte E-Mail Wochenberichte"
      ],
      ctaText: "Jetzt abonnieren",
      ctaHref: "/api/checkout?plan=yearly",
      popular: true,
      glow: "border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.35)]"
    },
    {
      name: "Lifetime",
      tagline: "Einmal zahlen, für immer nutzen",
      price: "250 €",
      period: "Einmalige Zahlung – Lebenslang",
      description: "Das Rundum-sorglos-Paket: Keine monatlichen Kosten, lebenslange Updates.",
      features: [
        "Alles aus dem Pro-Plan inklusive",
        "Einmalig 250 € – Nie wieder Abo-Gebühren",
        "Lebenslange Updates & neue Fächer",
        "Unbegrenzte PCs & Geräte",
        "Prioritäts-Support via WhatsApp/E-Mail",
        "VIP Beta-Zugang zu neuen Features"
      ],
      ctaText: "Lebenslang sichern",
      ctaHref: "/api/checkout?plan=lifetime",
      popular: false,
      glow: "border-purple-400/60 shadow-[0_0_40px_rgba(168,85,247,0.25)]"
    }
  ];

  return (
    <main className="bg-[#07090E] text-slate-100 min-h-screen relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200 py-20">
      
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-gradient-to-br from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-700/20 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-300">
            <Crown className="w-4 h-4 text-cyan-400" />
            <span>TRANSPARENTE PREISE OHNE VERSTECKTE KOSTEN</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Wähle den passenden Plan
          </h1>

          <p className="text-lg text-slate-400">
            Kostenlos mit 1 Profil starten oder einmalig auf Lifetime upgraden.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-[32px] backdrop-blur-2xl p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                p.popular
                  ? "bg-gradient-to-b from-white/[0.09] to-white/[0.03] border-2 " + p.glow
                  : "bg-white/[0.04] border border-white/[0.08] hover:border-white/20 " + p.glow
              }`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-indigo-600 text-white font-extrabold text-[11px] uppercase tracking-wider py-1.5 px-6 rounded-bl-2xl shadow-md">
                  Beliebteste Wahl
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{p.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{p.tagline}</p>

                <div className="mb-6 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{p.price}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">{p.period}</span>
                </div>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {p.description}
                </p>

                {/* Features list */}
                <div className="space-y-3 mb-8">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href={p.ctaHref}
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition duration-200 ${
                    p.popular
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                      : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10"
                  }`}
                >
                  {p.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
