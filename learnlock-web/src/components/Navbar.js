"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // If we are on dashboard, let the dashboard handle its own custom macOS glass frame
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const links = [
    { href: "/features", label: "Features" },
    { href: "/security", label: "Security" },
    { href: "/release-notes", label: "Release Notes" },
    { href: "/pricing", label: "Preise" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090E]/80 backdrop-blur-2xl transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/40 group-hover:scale-105 transition">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
            Learn<span className="text-cyan-400">lock</span>
          </span>
        </Link>
        
        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-semibold transition ${
                  isActive 
                    ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-slate-300 hover:text-white hidden sm:block transition px-3 py-2"
          >
            Login
          </Link>
          <Link 
            href="/download" 
            className="relative group px-6 py-2.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-2xl group-hover:opacity-90 transition shadow-[0_0_25px_rgba(6,182,212,0.5)]" />
            <div className="absolute inset-[1px] bg-[#0C1019]/30 backdrop-blur-md rounded-[15px] group-hover:bg-transparent transition duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Download
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}
