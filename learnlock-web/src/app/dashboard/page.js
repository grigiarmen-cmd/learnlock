import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Plus, Settings, Gamepad2, ShieldAlert, Clock, GraduationCap } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Protect the route
  if (!session) {
    redirect("/login");
  }

  // Dummy Data for Preview
  const tier = "Free"; // Replace with db value later
  const children = [
    { id: 1, name: "Max", age: 10, balance: 45, limit: 120, blocked: ["Minecraft", "Roblox"] },
    { id: 2, name: "Mia", age: 8, balance: 10, limit: 60, blocked: ["TikTok"] }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D3748]">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span className="font-bold text-xl tracking-tight text-gray-900">LearnLock</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600 hidden sm:block">{session.user.email}</span>
            <div className="h-6 w-px bg-gray-200"></div>
            <Link href="/api/auth/signout" className="text-sm text-gray-600 hover:text-red-500 flex items-center gap-2 transition">
              <LogOut className="w-4 h-4" />
              Abmelden
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Eltern-Dashboard</h1>
            <p className="text-gray-600 mt-1">Verwalte die Profile und Bildschirmzeiten deiner Kinder.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 text-sm shadow-sm">
              <span className="text-gray-500 font-bold">Abo:</span>
              <span className="font-bold text-orange-500">{tier} Plan</span>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition shadow-sm">
              <Plus className="w-4 h-4" />
              Profil hinzufügen
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Stats (Left Column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                Sicherheits-Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Web-Filter</span>
                  <span className="text-emerald-700 text-sm font-bold bg-emerald-100 px-2 py-0.5 rounded">Aktiv</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">App-Blocker</span>
                  <span className="text-emerald-700 text-sm font-bold bg-emerald-100 px-2 py-0.5 rounded">Aktiv</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Letzter Sync</span>
                  <span className="text-gray-400 text-sm font-medium">Vor 5 Min.</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <GraduationCap className="w-24 h-24 text-orange-900" />
              </div>
              <h3 className="font-bold text-orange-900 mb-2 relative z-10">LearnLock Premium</h3>
              <p className="text-sm text-orange-800/80 mb-4 relative z-10">
                Schalte unbegrenzte Profile und den Mathe-Modus frei.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg relative z-10 transition shadow-sm">
                Jetzt upgraden
              </button>
            </div>
          </div>

          {/* Children Profiles (Right Column) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kinder-Profile ({children.length})</h2>
            
            {children.map(child => (
              <div key={child.id} className="bg-white border border-gray-100 hover:border-gray-300 transition rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-lg font-bold">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{child.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{child.age} Jahre</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Clock className="w-3 h-3"/> Heute Gespielt</p>
                      <p className="font-bold text-lg text-gray-900">{child.balance} <span className="text-sm text-gray-400 font-medium">/ {child.limit} Min.</span></p>
                    </div>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Gamepad2 className="w-3 h-3"/> Blockiert</p>
                      <p className="font-bold text-sm text-gray-700">{child.blocked.length} Apps</p>
                    </div>
                  </div>

                  {/* Action */}
                  <div>
                    <button className="w-full sm:w-auto px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      Verwalten
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2 border border-gray-200">
                    <div 
                      className={`h-full rounded-full ${child.balance >= child.limit ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min((child.balance / child.limit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

      </main>
    </div>
  );
}
