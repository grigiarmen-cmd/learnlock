"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Startseite" },
    { href: "/features", label: "Funktionen" },
    { href: "/pedagogy", label: "Pädagogik" },
    { href: "/about", label: "Über uns" },
    { href: "/download", label: "Download" },
    { href: "/pricing", label: "Preise" },
    { href: "/notifications", label: "Reports" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span className="font-bold text-xl tracking-tight text-gray-900">LearnLock</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition ${pathname === link.href ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">
            Login
          </Link>
          <Link href="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2 rounded-xl transition shadow-md shadow-orange-500/20">
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
