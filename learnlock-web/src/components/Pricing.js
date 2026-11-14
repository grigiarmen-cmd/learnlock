"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Prices: [Monthly, Annual total]
  const prices = {
    basic: isAnnual ? "79.99" : "10",
    pro: isAnnual ? "119.99" : "15",
    ultra: isAnnual ? "199.99" : "25"
  };

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Wähle deinen Plan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Egal wie groß die Familie ist, wir haben den passenden Plan.
          </p>
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monatlich</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-orange-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-orange-500 transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Jährlich 
              <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Sparen!</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Basic Plan */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
            <p className="text-gray-500 text-sm mb-6 h-10">Perfekt für kleine Familien.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-gray-900">€{prices.basic}</span>
              <span className="text-gray-500 font-medium">/{isAnnual ? 'jahr' : 'monat'}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Bis zu 2 Kinder-Profile</li>
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Zeitlimits setzen</li>
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Web-Filter & App-Blocker</li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors">
              Auswählen
            </button>
          </div>

          {/* Pro Plan (Featured) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-orange-500 shadow-2xl shadow-orange-500/20 flex flex-col h-full relative transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Beliebtestes
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <p className="text-gray-500 text-sm mb-6 h-10">Für heranwachsende Familien & KI Assistenz.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-gray-900">€{prices.pro}</span>
              <span className="text-gray-500 font-medium">/{isAnnual ? 'jahr' : 'monat'}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Bis zu 5 Kinder-Profile</li>
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Locky KI-Chat Assistent</li>
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Mathe-Fokus-Score</li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all">
              Jetzt abonnieren
            </button>
          </div>

          {/* Ultra Plan */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ultra</h3>
            <p className="text-gray-500 text-sm mb-6 h-10">Das ultimative Familien-Paket.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-gray-900">€{prices.ultra}</span>
              <span className="text-gray-500 font-medium">/{isAnnual ? 'jahr' : 'monat'}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Bis zu 10 Kinder-Profile</li>
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Cloud-Sync Dashboard</li>
              <li className="flex gap-3 text-gray-600"><Check className="text-orange-500 shrink-0 w-5 h-5"/> Premium Support</li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors">
              Auswählen
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
