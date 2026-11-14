import Link from "next/link";
import { DownloadCloud, Monitor, FileKey, ShieldAlert } from "lucide-react";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">LearnLock für Windows</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Lade den Client herunter, um ihn auf dem PC deines Kindes zu installieren. Die Einrichtung dauert weniger als 2 Minuten.
        </p>

        <div className="bg-white border border-gray-200 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Monitor className="w-48 h-48 text-cyan-400" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Version 2.0 (Premium)</h2>
            <p className="text-gray-500 mb-8">Für Windows 10 & 11 (64-bit)</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/download/LearnLock-Setup.exe" 
                download="LearnLock-Setup.exe"
                className="flex items-center justify-center gap-3 flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-orange-500/30 text-lg"
              >
                <DownloadCloud className="w-6 h-6" />
                Setup Installer (.exe)
              </a>
              <a 
                href="/download/LearnLock-Portable.zip" 
                download="LearnLock-Portable.zip"
                className="flex items-center justify-center gap-2 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 rounded-xl transition text-base"
              >
                Portable (.zip)
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">Empfohlen: Ein-Klick-Installer (Setup.exe) für sofortige Installation mit Desktop-Icon.</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-8">So funktioniert die Installation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4 text-xl font-bold text-orange-500">1</div>
            <h4 className="text-gray-900 font-bold mb-2">Entpacken & Starten</h4>
            <p className="text-sm text-gray-600">Lade die .zip Datei herunter, entpacke sie in einen Ordner und starte <b>LearnLock.App.exe</b>.</p>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4 text-xl font-bold text-orange-500">2</div>
            <h4 className="text-gray-900 font-bold mb-2">PC Verknüpfen</h4>
            <p className="text-sm text-gray-600">Logge dich nach der Installation in der App mit deinem Eltern-Account ein.</p>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4 text-xl font-bold text-orange-500">3</div>
            <h4 className="text-gray-900 font-bold mb-2">Neustart (Wichtig)</h4>
            <p className="text-sm text-gray-600">Starte den PC einmal neu, damit der Web-Filter auf Systemebene greift.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
