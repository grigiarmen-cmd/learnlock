import { Mail, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Wöchentliche Reports</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bleib immer informiert. LearnLock sendet dir smarte E-Mail-Zusammenfassungen über das Lern- und Spielverhalten deiner Kinder.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden shadow-sm">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Was steht im Report?</h2>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-emerald-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold">Lern-Fortschritt</h4>
                  <p className="text-sm text-gray-600">Wie viele Aufgaben wurden gelöst? In welchen Fächern gibt es Schwierigkeiten?</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg">
                  <Monitor className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold">Bildschirmzeit-Bilanz</h4>
                  <p className="text-sm text-gray-600">Vergleich der genutzten Spielzeit mit der erarbeiteten Lernzeit (Fokus-Score).</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold">Sicherheits-Warnungen</h4>
                  <p className="text-sm text-gray-600">Wurde versucht, blockierte Apps zu öffnen oder den Web-Filter zu umgehen?</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 shrink-0">
              {/* Mock Email Graphic */}
              <div className="bg-[#FDFBF7] border border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Wochen-Report</p>
                    <p className="text-sm font-bold text-gray-900">LearnLock Update</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                  <div className="mt-6 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                    <p className="text-xs text-emerald-600 font-bold">85% Mathe-Ziele erreicht!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/login" className="inline-block bg-white hover:bg-gray-50 text-gray-700 font-bold px-8 py-3 rounded-xl border border-gray-200 transition shadow-sm">
            Benachrichtigungen im Dashboard verwalten
          </Link>
        </div>

      </div>
    </main>
  );
}

// Dummy Icon Component for the mock
function Monitor(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}
