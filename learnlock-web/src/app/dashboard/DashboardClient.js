"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  LogOut, 
  LayoutDashboard, 
  BarChart2, 
  BookOpen, 
  ShieldAlert, 
  Settings, 
  Bell, 
  Lock, 
  MoreHorizontal, 
  TrendingUp,
  Sparkles,
  ChevronDown,
  Plus,
  Users,
  Camera,
  Upload,
  Check,
  X,
  Clock,
  Gamepad2,
  Trash2
} from "lucide-react";

export default function DashboardClient({ initialUser }) {
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "profiles" | "statistics" | "settings"
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);

  // Preset Avatars
  const presetAvatars = [
    { id: "girl1", emoji: "👧", name: "Mädchen", bg: "from-pink-400 to-rose-500" },
    { id: "boy1", emoji: "👦", name: "Junge", bg: "from-cyan-400 to-blue-600" },
    { id: "dog", emoji: "🐶", name: "Welpe", bg: "from-amber-400 to-orange-500" },
    { id: "cat", emoji: "🐱", name: "Kätzchen", bg: "from-purple-400 to-indigo-500" },
    { id: "fox", emoji: "🦊", name: "Fuchs", bg: "from-orange-400 to-red-500" },
    { id: "robot", emoji: "🤖", name: "Roboter", bg: "from-teal-400 to-emerald-600" },
    { id: "astronaut", emoji: "🚀", name: "Astronaut", bg: "from-blue-500 to-purple-600" },
    { id: "superhero", emoji: "🦸", name: "Held", bg: "from-red-500 to-yellow-500" },
  ];

  // State of child profiles
  const [children, setChildren] = useState([
    {
      id: 1,
      name: "Anna",
      age: 8,
      grade: 3,
      avatarType: "emoji",
      avatarEmoji: "👧",
      avatarBg: "from-pink-400 to-rose-500",
      avatarImage: null,
      dailyLimit: 60,
      blockedApps: "Roblox, Minecraft",
      allowedSubjects: ["Mathe", "Deutsch"],
      balanceMinutes: 45
    },
    {
      id: 2,
      name: "Lukas",
      age: 11,
      grade: 5,
      avatarType: "emoji",
      avatarEmoji: "👦",
      avatarBg: "from-cyan-400 to-blue-600",
      avatarImage: null,
      dailyLimit: 90,
      blockedApps: "Steam, Discord, Fortnite",
      allowedSubjects: ["Mathe", "Englisch", "Biologie"],
      balanceMinutes: 15
    }
  ]);

  // Form State for adding a new profile
  const [newProfile, setNewProfile] = useState({
    name: "",
    age: 9,
    grade: 4,
    dailyLimit: 60,
    blockedApps: "Roblox, Minecraft",
    avatarType: "emoji", // "emoji" or "image"
    selectedPreset: presetAvatars[0],
    customImageData: null,
    allowedSubjects: ["Mathe", "Deutsch"]
  });

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfile({
          ...newProfile,
          avatarType: "image",
          customImageData: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!newProfile.name.trim()) return;

    const created = {
      id: Date.now(),
      name: newProfile.name,
      age: Number(newProfile.age),
      grade: Number(newProfile.grade),
      avatarType: newProfile.avatarType,
      avatarEmoji: newProfile.selectedPreset.emoji,
      avatarBg: newProfile.selectedPreset.bg,
      avatarImage: newProfile.customImageData,
      dailyLimit: Number(newProfile.dailyLimit),
      blockedApps: newProfile.blockedApps,
      allowedSubjects: newProfile.allowedSubjects,
      balanceMinutes: 0
    };

    setChildren([...children, created]);
    setShowAddProfileModal(false);
    // Reset form
    setNewProfile({
      name: "",
      age: 9,
      grade: 4,
      dailyLimit: 60,
      blockedApps: "Roblox, Minecraft",
      avatarType: "emoji",
      selectedPreset: presetAvatars[0],
      customImageData: null,
      allowedSubjects: ["Mathe", "Deutsch"]
    });
  };

  const handleDeleteProfile = (id) => {
    setChildren(children.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Liquid Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-purple-600/25 via-pink-600/15 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-700/20 via-cyan-500/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Floating Liquid Glass Orbs */}
      <div className="absolute top-12 right-24 w-32 h-32 rounded-full bg-gradient-to-tr from-white/10 via-cyan-400/15 to-transparent backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(56,189,248,0.2)] pointer-events-none hidden lg:block" />
      <div className="absolute bottom-16 left-12 w-24 h-24 rounded-full bg-gradient-to-tr from-white/10 via-purple-500/15 to-transparent backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] pointer-events-none hidden lg:block" />

      <div className="relative z-10 max-w-[1540px] mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Outer Liquid Glass Frame (MacOS Style) */}
        <div className="rounded-[36px] bg-[#0C1019]/75 backdrop-blur-2xl border border-white/[0.09] shadow-[0_20px_70px_rgba(0,0,0,0.85)] p-5 sm:p-7 lg:p-8 flex flex-col lg:flex-row gap-8 min-h-[860px]">
          
          {/* Sidebar */}
          <aside className="lg:w-64 flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.07] pb-6 lg:pb-0 lg:pr-6">
            <div className="space-y-8">
              {/* Window Dots & Logo */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-[0_0_8px_rgba(255,95,86,0.6)]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-[0_0_8px_rgba(255,189,46,0.6)]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-[0_0_8px_rgba(39,201,63,0.6)]" />
                </div>
                
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/40">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white font-sans">
                    Learn<span className="text-cyan-400">lock</span>
                  </span>
                </Link>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition ${
                    activeTab === "dashboard"
                      ? "bg-gradient-to-r from-white/[0.12] to-white/[0.03] text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <LayoutDashboard className={`w-5 h-5 ${activeTab === "dashboard" ? "text-cyan-400" : ""}`} />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("profiles")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium transition ${
                    activeTab === "profiles"
                      ? "bg-gradient-to-r from-white/[0.12] to-white/[0.03] text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-5 h-5 ${activeTab === "profiles" ? "text-cyan-400" : ""}`} />
                    <span>Kinderprofile</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                    {children.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("statistics")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition ${
                    activeTab === "statistics"
                      ? "bg-gradient-to-r from-white/[0.12] to-white/[0.03] text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <BarChart2 className={`w-5 h-5 ${activeTab === "statistics" ? "text-cyan-400" : ""}`} />
                  <span>Statistiken</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition ${
                    activeTab === "settings"
                      ? "bg-gradient-to-r from-white/[0.12] to-white/[0.03] text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Settings className={`w-5 h-5 ${activeTab === "settings" ? "text-cyan-400" : ""}`} />
                  <span>Einstellungen</span>
                </button>
              </nav>
            </div>

            {/* Bottom User status */}
            <div className="pt-6 border-t border-white/[0.07] flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs text-slate-400">Angemeldet als</p>
                <p className="text-sm font-semibold text-slate-200 truncate">{initialUser?.email || "eltern@learnlock.de"}</p>
              </div>
              <Link
                href="/api/auth/signout"
                title="Abmelden"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition border border-white/5"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <main className="flex-1 space-y-7">
            
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "profiles" && "Kinderprofile & Avatare"}
                  {activeTab === "statistics" && "Lernstatistiken"}
                  {activeTab === "settings" && "Eltern-Einstellungen"}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                    Liquid Live
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">Echtzeit-Überwachung aller Lernzeiten & Schutzschilde</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProfileModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Kind anlegen</span>
                </button>

                <button 
                  type="button"
                  className="relative p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 transition shadow-inner"
                  title="Benachrichtigungen"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                </button>

                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1.5px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <div className="w-full h-full rounded-[14px] bg-[#0C1019] flex items-center justify-center font-bold text-white text-sm">
                    E
                  </div>
                </div>
              </div>
            </div>

            {/* TAB: DASHBOARD VIEW */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Card 1 (Top Left): Learning Charts Bar Graph */}
                <div className="xl:col-span-7 rounded-[30px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-bold text-white tracking-wide">Learning Charts</h2>
                      <button type="button" className="text-slate-400 hover:text-white transition">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* 3 Metric Pills */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
                          <BarChart2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-white">383</p>
                          <p className="text-[11px] text-slate-400">Aufgaben gelöst</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-purple-300">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-white">23.29K</p>
                          <p className="text-[11px] text-slate-400">Lern-Punkte</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-white">92%</p>
                          <p className="text-[11px] text-slate-400">Erfolgsquote</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Glowing Gradient Bar Chart */}
                  <div className="pt-2">
                    <div className="flex items-end justify-between gap-3 h-52 px-2 pb-2 border-b border-white/[0.06]">
                      {[
                        { month: "Jan", height: "45%", value: "18h" },
                        { month: "Feb", height: "92%", value: "38h" },
                        { month: "Mar", height: "65%", value: "26h" },
                        { month: "Apr", height: "38%", value: "15h" },
                        { month: "May", height: "78%", value: "31h" },
                        { month: "Jun", height: "100%", value: "42h" },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <div className="text-[11px] font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition duration-200">
                            {item.value}
                          </div>
                          <div className="w-full max-w-[42px] bg-white/[0.04] rounded-2xl p-1 flex items-end justify-center h-full">
                            <div 
                              style={{ height: item.height }}
                              className="w-full rounded-xl bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.45)] group-hover:brightness-125 transition-all duration-300 relative overflow-hidden"
                            >
                              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl pointer-events-none" />
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 group-hover:text-white transition font-medium">
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card 2 (Top Right): Liquid Circular Timer (Study Session Locked) */}
                <div className="xl:col-span-5 rounded-[30px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white tracking-wide">Aktiver Status</h2>
                    <button type="button" className="text-slate-400 hover:text-white transition">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Circular Glowing Ring */}
                  <div className="my-auto py-6 flex flex-col items-center justify-center relative">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="50%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        <circle cx="100" cy="100" r="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="14" fill="transparent" />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          stroke="url(#neonGradient)"
                          strokeWidth="14"
                          strokeDasharray={2 * Math.PI * 80}
                          strokeDashoffset={2 * Math.PI * 80 * 0.25}
                          strokeLinecap="round"
                          fill="transparent"
                          filter="url(#glow)"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
                          Study Session Locked
                        </p>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                          00:45:00
                        </h3>
                        <div className="mt-3 w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                          <Lock className="w-4 h-4 text-pink-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                      Spiele gesperrt bis Aufgaben gelöst
                    </span>
                    <span className="font-semibold text-slate-200">
                      {children[0]?.name || "Kind"} (Klasse {children[0]?.grade || 4})
                    </span>
                  </div>
                </div>

                {/* Card 3 (Bottom Left): Smooth Multi-Wave Flow Chart */}
                <div className="xl:col-span-7 rounded-[30px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white tracking-wide">Learning Progress</h2>
                    <div className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <span>Monatlich</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="relative h-48 w-full mt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="40%" stopColor="#38bdf8" />
                          <stop offset="70%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                      <path
                        d="M 0 140 Q 60 80, 120 120 T 240 70 T 360 120 T 500 90 L 500 180 L 0 180 Z"
                        fill="url(#waveFill)"
                      />

                      <path
                        d="M 0 140 Q 60 80, 120 120 T 240 70 T 360 120 T 500 90"
                        fill="transparent"
                        stroke="url(#waveStroke)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#waveGlow)"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400 font-medium px-2 pt-3 border-t border-white/[0.06]">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>

                {/* Card 4 (Bottom Right): Learning Stats Dual Trendlines */}
                <div className="xl:col-span-5 rounded-[30px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-bold text-white tracking-wide">Learning Stats</h2>
                      <button type="button" className="text-slate-400 hover:text-white transition">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold mb-4">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        Aktuelle Woche
                      </span>
                      <span className="flex items-center gap-1.5 text-purple-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                        Vorwoche
                      </span>
                    </div>
                  </div>

                  <div className="relative h-44 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 320 160" preserveAspectRatio="none">
                      <defs>
                        <filter id="neonLine" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      <line x1="0" y1="40" x2="320" y2="40" stroke="rgba(255,255,255,0.05)" />
                      <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.05)" />
                      <line x1="0" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.05)" />

                      <path
                        d="M 10 130 Q 60 110, 110 125 T 200 95 T 310 60"
                        fill="transparent"
                        stroke="#a855f7"
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#neonLine)"
                        opacity="0.8"
                      />

                      <path
                        d="M 10 145 Q 70 135, 120 100 T 220 75 T 310 30"
                        fill="transparent"
                        stroke="#22d3ee"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#neonLine)"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400 font-medium px-2 pt-3 border-t border-white/[0.06]">
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                    <span>50</span>
                    <span>60</span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: PROFILES & AVATARS VIEW */}
            {activeTab === "profiles" && (
              <div className="space-y-6">
                
                {/* Profiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {children.map((child) => (
                    <div 
                      key={child.id}
                      className="rounded-[30px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between relative group hover:border-cyan-400/50 transition-all duration-300"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteProfile(child.id)}
                        title="Profil löschen"
                        className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div>
                        {/* Profile Avatar (Uploaded image or chosen emoji preset) */}
                        <div className="flex items-center gap-4 mb-6">
                          {child.avatarType === "image" && child.avatarImage ? (
                            <img
                              src={child.avatarImage}
                              alt={child.name}
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                            />
                          ) : (
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${child.avatarBg} flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-white/20`}>
                              {child.avatarEmoji}
                            </div>
                          )}

                          <div>
                            <h3 className="text-xl font-bold text-white">{child.name}</h3>
                            <p className="text-xs text-cyan-300 font-semibold">{child.age} Jahre • Klasse {child.grade}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 text-[10px] font-bold">
                              Aktiv geschützt
                            </span>
                          </div>
                        </div>

                        {/* Child Stats & Limits */}
                        <div className="space-y-3 mb-6">
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-cyan-400" />
                              Tägliches Zeitlimit
                            </span>
                            <span className="font-bold text-white">{child.dailyLimit} Minuten</span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-2">
                              <Gamepad2 className="w-4 h-4 text-purple-400" />
                              Blockierte Apps
                            </span>
                            <span className="font-semibold text-slate-300 truncate max-w-[140px]" title={child.blockedApps}>
                              {child.blockedApps}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-emerald-400" />
                              Lernfächer
                            </span>
                            <span className="font-semibold text-slate-300">
                              {child.allowedSubjects?.join(", ") || "Mathe, Deutsch"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Earned Time Bar */}
                      <div className="pt-4 border-t border-white/[0.06] space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Verdiente Spielzeit</span>
                          <span className="font-bold text-cyan-300">{child.balanceMinutes} Min. frei</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${Math.min(100, (child.balanceMinutes / child.dailyLimit) * 100)}%` }}
                            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Profile Card Trigger */}
                  <button
                    type="button"
                    onClick={() => setShowAddProfileModal(true)}
                    className="rounded-[30px] border-2 border-dashed border-white/10 hover:border-cyan-400/50 bg-white/[0.02] hover:bg-white/[0.04] p-8 flex flex-col items-center justify-center text-center gap-4 transition duration-300 min-h-[340px] group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition">
                      <Plus className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">Neues Kinderprofil</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                        Eigenes Bild hochladen oder Avatar aus Presets auswählen
                      </p>
                    </div>
                  </button>
                </div>

              </div>
            )}

            {/* TAB: STATS / SETTINGS FALLBACK PREVIEWS */}
            {(activeTab === "statistics" || activeTab === "settings") && (
              <div className="rounded-[30px] bg-white/[0.04] border border-white/[0.08] p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeTab === "statistics" ? "Wöchentliche Auswertung & Lernfortschritt" : "System-Einstellungen & Eltern-PIN"}
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Alle Änderungen werden sofort über den zentralen ProgramData-Sync mit dem Desktop-Client auf diesem PC synchronisiert.
                </p>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* MODAL: Neues Kinderprofil anlegen (Avatar Presets + Upload) */}
      {showAddProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="rounded-[32px] bg-[#0C1019] border border-white/20 p-6 sm:p-8 max-w-xl w-full shadow-[0_20px_70px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setShowAddProfileModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                Neues Profil einrichten
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Lade ein Foto hoch oder wähle einen Lieblings-Avatar für dein Kind aus.
              </p>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-6">
              
              {/* AVATAR SELECTION SECTION */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Profilbild oder Avatar
                </label>

                {/* Upload or Preset Preview */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  {newProfile.avatarType === "image" && newProfile.customImageData ? (
                    <img 
                      src={newProfile.customImageData} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${newProfile.selectedPreset.bg} flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-white/20`}>
                      {newProfile.selectedPreset.emoji}
                    </div>
                  )}

                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold flex items-center gap-2 border border-white/10 transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      Eigenes Foto hochladen
                    </button>
                    <p className="text-[11px] text-slate-400">JPG, PNG oder WebP bis 5MB</p>
                  </div>
                </div>

                {/* Preset Avatars Row */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] text-slate-400">Oder wähle einen Avatar:</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {presetAvatars.map((preset) => {
                      const isSelected = newProfile.avatarType === "emoji" && newProfile.selectedPreset.id === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setNewProfile({ ...newProfile, avatarType: "emoji", selectedPreset: preset })}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                            isSelected
                              ? "bg-cyan-500/20 border-2 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                              : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.08]"
                          }`}
                        >
                          {preset.emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* INPUT FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Vorname des Kindes</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Timmy"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tägliches Limit (Minuten)</label>
                  <input
                    type="number"
                    min="10"
                    max="480"
                    value={newProfile.dailyLimit}
                    onChange={(e) => setNewProfile({ ...newProfile, dailyLimit: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Klassenstufe</label>
                  <select
                    value={newProfile.grade}
                    onChange={(e) => setNewProfile({ ...newProfile, grade: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F1420] border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                      <option key={g} value={g} className="bg-[#0C1019] text-white">Klasse {g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Blockierte Apps (getrennt durch Komma)</label>
                  <input
                    type="text"
                    placeholder="discord, steam, roblox"
                    value={newProfile.blockedApps}
                    onChange={(e) => setNewProfile({ ...newProfile, blockedApps: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddProfileModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-sm font-semibold transition"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition"
                >
                  Profil speichern
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
