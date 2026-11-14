import { ShieldCheck, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Über LearnLock</h1>
          <p className="text-lg text-gray-600">
            Unsere Mission: Die digitale Erziehung revolutionieren.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 text-gray-700 leading-relaxed space-y-8 shadow-sm">
          <p>
            LearnLock entstand aus einem einfachen Problem: Wie können wir unseren Kindern den Zugang zu digitalen Medien gewähren, ohne dass die schulische Leistung darunter leidet? 
          </p>
          <p>
            Herkömmliche App-Blocker setzen harte Limits. Ist die Zeit abgelaufen, wird der Bildschirm schwarz. Das führt oft zu Frustration und Streit. Wir haben uns gefragt: Was wäre, wenn Kinder sich ihre Spielzeit "verdienen" könnten?
          </p>
          <p>
            Mit LearnLock haben wir genau das geschaffen. Eine intelligente Software, die Spielzeit direkt an Lernziele knüpft. Bevor Minecraft startet, müssen 10 Matheaufgaben gelöst werden. Der PC ist nicht mehr der Feind, sondern der Motivator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Sicher</h3>
            <p className="text-sm text-gray-600">Keine Schlupflöcher. Schutz auf Systemebene.</p>
          </div>
          <div className="text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Von Eltern entwickelt</h3>
            <p className="text-sm text-gray-600">Gemacht für die Herausforderungen des Familienalltags.</p>
          </div>
          <div className="text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Starke Community</h3>
            <p className="text-sm text-gray-600">Über 2.000 Familien vertrauen bereits auf uns.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
