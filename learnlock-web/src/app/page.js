import Link from "next/link";
import { Heart, Sparkles, Gamepad2, Smile, Star, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-[#FDFBF7] text-[#2D3748]">
      {/* Warm Hero Section */}
      <section className="py-20 md:py-32 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-6">
            <Heart className="w-4 h-4" /> Von Eltern für Eltern
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            Mehr Motivation, <br className="hidden md:block"/> weniger Streit.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Der freundliche Begleiter, der Computerspiele in eine Belohnung verwandelt. 
            Lass dein Kind erst spielerisch lernen, bevor Minecraft & Co. starten. 
            <strong className="text-gray-900 font-semibold"> Stressfrei und automatisch.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/download" className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-lg shadow-orange-500/30 text-lg flex items-center justify-center gap-2">
              Kostenlos ausprobieren <Sparkles className="w-5 h-5" />
            </Link>
            <Link href="/about" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold border border-gray-200 rounded-2xl transition text-lg">
              So funktioniert's
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <div className="flex -space-x-1 mr-2">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            </div>
            Über 2.000 entspannte Familien
          </div>
        </div>

        {/* Hero Images Grid */}
        <div className="max-w-6xl mx-auto px-4 mt-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-200 rounded-3xl transform -rotate-2 scale-105 transition-transform group-hover:rotate-0"></div>
              <img src="/hero-learning.png" alt="Kind lernt am PC mit LearnLock" className="relative z-10 w-full h-auto rounded-3xl shadow-xl border border-gray-100 object-cover aspect-video" />
              <div className="absolute -bottom-6 -right-6 bg-white border border-gray-100 p-4 rounded-2xl shadow-lg z-20 flex items-center gap-3">
                 <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">1.</div>
                 <div>
                   <p className="font-bold text-gray-900">Lernzeit</p>
                   <p className="text-xs text-gray-500">Matheaufgaben lösen</p>
                 </div>
              </div>
            </div>
            
            <div className="relative group mt-12 md:mt-0">
              <div className="absolute inset-0 bg-emerald-200 rounded-3xl transform rotate-2 scale-105 transition-transform group-hover:rotate-0"></div>
              <img src="/hero-gaming.png" alt="Kind spielt nach dem Lernen" className="relative z-10 w-full h-auto rounded-3xl shadow-xl border border-gray-100 object-cover aspect-video" />
              <div className="absolute -bottom-6 -left-6 bg-white border border-gray-100 p-4 rounded-2xl shadow-lg z-20 flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">2.</div>
                 <div>
                   <p className="font-bold text-gray-900">Spielzeit</p>
                   <p className="text-xs text-gray-500">Erfolgreich freigeschaltet</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Data Section */}
      <section className="py-12 bg-[#FDFBF7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Erwiesene Wirkung</h3>
              <p className="text-gray-600 mb-8">Durchschnittliche Entwicklung nach 4 Wochen mit LearnLock.</p>
              
              {/* CSS Bar Chart */}
              <div className="space-y-6">
                
                {/* Week 1 */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold text-gray-700">
                    <span>Woche 1</span>
                  </div>
                  <div className="flex h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-full w-[20%] flex items-center px-2 text-[10px] text-white font-bold" title="Lernzeit">Lernzeit</div>
                    <div className="bg-gray-300 h-full w-[80%] flex items-center px-2 text-[10px] text-gray-600 font-bold justify-end" title="Konsum">Reiner Konsum</div>
                  </div>
                </div>

                {/* Week 2 */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold text-gray-700">
                    <span>Woche 2</span>
                  </div>
                  <div className="flex h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full w-[45%] flex items-center px-2 text-[10px] text-white font-bold transition-all duration-1000">Gesteigerte Lernzeit</div>
                    <div className="bg-gray-300 h-full w-[55%] flex items-center px-2 text-[10px] text-gray-600 font-bold justify-end transition-all duration-1000">Weniger Konsum</div>
                  </div>
                </div>

                {/* Week 4 */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-bold text-gray-700">
                    <span className="text-emerald-600">Woche 4 (Ziel erreicht)</span>
                  </div>
                  <div className="flex h-8 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-emerald-100">
                    <div className="bg-emerald-500 h-full w-[65%] flex items-center px-3 text-xs text-white font-bold shadow-sm transition-all duration-1000">Produktive Lernzeit</div>
                    <div className="bg-emerald-100 h-full w-[35%] flex items-center px-3 text-xs text-emerald-800 font-bold justify-end transition-all duration-1000">Belohnung</div>
                  </div>
                </div>

              </div>
            </div>

            <div className="md:w-72 shrink-0 bg-orange-50 p-6 rounded-3xl border border-orange-100 text-center">
               <div className="text-5xl font-extrabold text-orange-600 mb-2">+120%</div>
               <p className="font-bold text-gray-900 mb-4">Mehr gelöste Schulaufgaben</p>
               <p className="text-sm text-gray-600">Kinder lösen freiwillig Aufgaben, um sich ihre Bildschirmzeit zu verdienen.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ein positiver Ansatz zur Bildschirmzeit</h2>
            <p className="text-gray-600 text-lg">Keine harten Verbote, die nur für Tränen sorgen. Wir setzen auf spielerische Motivation und Eigenverantwortung.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FDFBF7] border border-gray-100 p-8 rounded-3xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Smile className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lernen als Mini-Spiel</h3>
              <p className="text-gray-600 leading-relaxed">Dein Kind löst kleine, spaßige Mathe-Aufgaben. Jede richtige Antwort füllt das "Spielzeit-Konto" auf. Lernen wird zum Level-Up!</p>
            </div>
            
            <div className="bg-[#FDFBF7] border border-gray-100 p-8 rounded-3xl hover:shadow-lg transition relative overflow-hidden">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sicheres Umfeld</h3>
              <p className="text-gray-600 leading-relaxed">Während gelernt wird, sind Ablenkungen blockiert. Wir sorgen leise im Hintergrund dafür, dass nicht-jugendfreie Seiten unsichtbar bleiben.</p>
            </div>

            <div className="bg-[#FDFBF7] border border-gray-100 p-8 rounded-3xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Gamepad2 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stolz auf die Spielzeit</h3>
              <p className="text-gray-600 leading-relaxed">Kinder genießen ihre Spielzeit viel mehr, wenn sie wissen, dass sie sich diese ehrlich "verdient" haben. Das stärkt das Selbstbewusstsein.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">In 3 einfachen Schritten zur Harmonie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white shadow-md rounded-full flex items-center justify-center mb-6 text-2xl font-bold text-orange-500">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">App installieren</h3>
              <p className="text-gray-600 max-w-xs text-center">Einmalig auf dem Computer des Kindes einrichten. Es dauert nur eine Minute.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white shadow-md rounded-full flex items-center justify-center mb-6 text-2xl font-bold text-orange-500">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regeln festlegen</h3>
              <p className="text-gray-600 max-w-xs text-center">Bestimme auf deinem Handy ganz entspannt, welche Lernziele erreicht werden sollen.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-500 shadow-xl shadow-orange-500/30 rounded-full flex items-center justify-center mb-6 text-2xl font-bold text-white">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Durchatmen</h3>
              <p className="text-gray-600 max-w-xs text-center">Kein Diskutieren mehr. Die App übernimmt die Motivation und du erhältst stolze Erfolgsberichte.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Mach den Alltag wieder entspannter</h2>
          <p className="text-gray-600 text-lg mb-10">Lass uns gemeinsam den Medienkonsum deiner Kinder in eine positive Lernerfahrung verwandeln.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/download" className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-lg shadow-orange-500/30">
              Jetzt kostenlos starten
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
