import Link from "next/link";
import { Brain, HeartHandshake, Zap, Trophy } from "lucide-react";

export default function PedagogyPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-20">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-bold rounded-full mb-6">
          Der psychologische Ansatz
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Warum Belohnung besser wirkt als harte Verbote</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Strenge Bildschirmzeiten führen oft zu Frustration, Heimlichkeit und Familienstreit. 
          LearnLock nutzt Erkenntnisse aus der Lernpsychologie, um diesen Teufelskreis zu durchbrechen.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Das Problem starrer Limits</h3>
            <p className="text-gray-600 leading-relaxed">
              Wenn die Zeit abgelaufen ist, reißt die Software das Kind oft mitten aus einem Erfolgserlebnis (z.B. einem Boss-Kampf). Das erzeugt Wut. Zudem haben Kinder das Gefühl, dass ihnen etwas grundlos "weggenommen" wird.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] z-0"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Die LearnLock Lösung</h3>
              <p className="text-gray-600 leading-relaxed">
                Spielzeit wird zur **Währung**. Kinder erarbeiten sich ihre Zeit aktiv durch Lernen. Die Zeit ist nicht mehr "von den Eltern gegeben", sondern "selbst verdient". Das stärkt die Eigenverantwortung enorm.
              </p>
            </div>
          </div>

        </div>

        {/* Deep Dive Section */}
        <div className="bg-orange-50 border border-orange-100 rounded-[3rem] p-8 md:p-16 mb-24">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Extrinsische vs. Intrinsische Motivation</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Am Anfang ist die Motivation deines Kindes *extrinsisch* – es rechnet Aufgaben nur, um Minecraft spielen zu dürfen.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Doch mit der Zeit passiert etwas Magisches: Das regelmäßige, kurze Wiederholen von Schulstoff (Microlearning) führt zu besseren Noten in der Schule. Diese echten Erfolgserlebnisse verwandeln die Motivation in *intrinsische* Motivation – das Kind lernt plötzlich, weil es merkt, dass es den Stoff besser versteht!
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold text-gray-900 mb-6 text-center">Der LearnLock Kreislauf</h4>
                
                <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">1</div>
                    <p className="text-gray-700 font-medium">Kind will spielen, muss aber erst lernen.</p>
                  </div>
                  <div className="w-1 h-6 bg-gray-200 ml-5"></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">2</div>
                    <p className="text-gray-700 font-medium">Kind erarbeitet sich Stolz die Spielzeit.</p>
                  </div>
                  <div className="w-1 h-6 bg-gray-200 ml-5"></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">3</div>
                    <p className="text-gray-700 font-medium">Noten verbessern sich durch stete Übung.</p>
                  </div>
                  <div className="w-1 h-6 bg-gray-200 ml-5"></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">4</div>
                    <p className="text-gray-700 font-medium">Kind entwickelt Freude am Schulstoff!</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
