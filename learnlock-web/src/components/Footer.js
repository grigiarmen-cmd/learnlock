import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#FDFBF7] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span className="font-bold text-lg text-gray-900">LearnLock</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Verwandle Spielzeit in Lernzeit. Die smarte Kindersicherung mit Mathe-Modus.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4">Produkt</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/features" className="hover:text-orange-500 transition">Funktionen</Link></li>
              <li><Link href="/pedagogy" className="hover:text-orange-500 transition">Konzept</Link></li>
              <li><Link href="/about" className="hover:text-orange-500 transition">Über uns</Link></li>
              <li><Link href="/download" className="hover:text-orange-500 transition">Download</Link></li>
              <li><Link href="/pricing" className="hover:text-orange-500 transition">Preise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/notifications" className="hover:text-orange-500 transition">E-Mail Reports</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">FAQ</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-orange-500 transition">Datenschutz</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Impressum</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">AGB</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs font-medium">
            © {new Date().getFullYear()} LearnLock. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
