import Link from "next/link";
import { ShieldCheck, BookOpen, GlobeLock, Check, Lock, Smartphone } from "lucide-react";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-20">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Alle Funktionen im Detail</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          LearnLock vereint Sicherheit auf Systemebene mit pädagogisch wertvollen Lernanreizen. Entdecke, wie wir den Familienalltag entspannter machen.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* Feature 1: The Math Mode (Learning) */}
        <section className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-2">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Der Lern-Modus (Mathe)</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Statt stumpfem Warten müssen sich Kinder ihre Spielzeit erarbeiten. Der intelligente Mathe-Modus passt die Schwierigkeit der Aufgaben dynamisch an das Alter (Klassenstufe 1-10) an.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Pädagogisch wertvoll:</strong> Belohnung für echte Anstrengung, nicht für Zeitabsitzen.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Altersgerecht:</strong> Vom kleinen Einmaleins bis zu komplexen Gleichungen.</span>
              </li>
              <li className="flex items-start gap-3 opacity-60">
                <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 shrink-0">Demnächst</div>
                <span className="text-gray-700"><strong>Vokabel-Training:</strong> Bald auch für Englisch, Französisch und Spanisch verfügbar.</span>
              </li>
            </ul>
          </div>
          
          {/* Visual: Math Mockup */}
          <div className="flex-1 w-full max-w-md relative">
            <div className="absolute inset-0 bg-orange-200 rounded-[3rem] transform rotate-3 scale-105"></div>
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl relative z-10">
              <div className="text-center mb-6">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Mathe-Challenge</p>
                <div className="text-4xl font-extrabold text-gray-900">12 × 8 = ?</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center font-bold text-xl text-gray-600">86</div>
                <div className="bg-orange-50 border-2 border-orange-500 p-4 rounded-xl text-center font-bold text-xl text-orange-600">96</div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center font-bold text-xl text-gray-600">106</div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center font-bold text-xl text-gray-600">112</div>
              </div>
              <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4"></div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">7 von 10 richtig gelöst</p>
            </div>
          </div>
        </section>

        {/* Feature 2: App Blocker */}
        <section className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Systemweiter App-Blocker</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Im Gegensatz zu Browser-Erweiterungen greift unser Blocker tief auf Windows-Ebene. 
              Wir sperren die Prozesse der Spiele direkt. Minecraft, Roblox, Fortnite & Co. lassen sich ohne verdiente Spielzeit nicht starten.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Unumgehbar:</strong> Selbst wenn der PC neu gestartet wird, bleibt der Schutz aktiv.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Individuell:</strong> Bestimme für jedes Kind einzeln, welche Apps gesperrt sind.</span>
              </li>
            </ul>
          </div>
          
          {/* Visual: Lock Mockup */}
          <div className="flex-1 w-full max-w-md relative">
            <div className="absolute inset-0 bg-emerald-200 rounded-[3rem] transform -rotate-3 scale-105"></div>
            <div className="bg-gray-900 p-8 rounded-3xl shadow-xl relative z-10 border border-gray-800">
              <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                <span className="text-white font-bold">Prozesse</span>
                <span className="text-gray-400 text-sm">Status</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">Word</div>
                    <span className="text-gray-300">WINWORD.EXE</span>
                  </div>
                  <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-1 rounded">Erlaubt</span>
                </div>
                <div className="flex items-center justify-between bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                    <span className="text-gray-300">Minecraft.exe</span>
                  </div>
                  <span className="text-red-400 text-sm font-bold bg-red-400/10 px-2 py-1 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Blockiert
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 3: Web Filter */}
        <section className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-2">
              <GlobeLock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sicherer Web-Filter (DNS)</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Damit das Internet nicht zum Risiko wird, schaltet LearnLock automatisch einen familienfreundlichen DNS-Filter vor jede Suchanfrage.
              Nicht-jugendfreie Seiten werden blockiert, noch bevor der Browser sie überhaupt laden kann.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>Pornografie & Gewalt:</strong> Automatisch gesperrt.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>SafeSearch:</strong> Zwingt Google und YouTube in den strengen Sicherheitsmodus.</span>
              </li>
            </ul>
          </div>
          
          {/* Visual: DNS Diagram Mockup */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm text-center">
               <div className="flex flex-col items-center gap-4">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                   <Smartphone className="w-8 h-8 text-gray-600" />
                 </div>
                 <div className="w-1 h-8 bg-gray-200"></div>
                 <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl relative">
                   <span className="font-bold text-blue-800">LearnLock DNS Filter</span>
                   <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center text-red-500">
                     <span className="block w-8 h-1 bg-red-200 mr-2"></span>
                     <Lock className="w-5 h-5" />
                   </div>
                 </div>
                 <div className="w-1 h-8 bg-gray-200"></div>
                 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                   <Check className="w-8 h-8 text-emerald-600" />
                 </div>
               </div>
            </div>
          </div>
        </section>
        
      </div>
    </main>
  );
}
