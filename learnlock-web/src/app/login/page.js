"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await signIn('email', {
        email: email,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (res?.error) {
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Willkommen zurück</h1>
          <p className="text-gray-600">Logge dich in dein Eltern-Dashboard ein.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">E-Mail prüfen</h2>
              <p className="text-gray-600 text-sm">
                Wir haben einen magischen Login-Link an <strong>{email}</strong> gesendet. Klicke darauf, um dich anzumelden.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-6 text-sm text-gray-500 hover:text-gray-900 transition"
              >
                Andere E-Mail verwenden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">E-Mail Adresse</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                    placeholder="eltern@beispiel.de"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-xs mt-2">Es gab einen Fehler. Bitte versuche es erneut.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-white font-bold bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Mit E-Mail einloggen
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-500">
          Durch den Login stimmst du unseren Nutzungsbedingungen und Datenschutzrichtlinien zu.
        </p>
      </div>
    </div>
  );
}
