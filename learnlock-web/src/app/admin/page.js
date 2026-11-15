"use client";

import { useState } from "react";

export default function AdminPage() {
  const [step, setStep] = useState(1); // 1 = Login, 2 = 2FA, 3 = Dashboard
  const [email, setEmail] = useState("grizzlygoegym@gmail.com");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard Data
  const [users, setUsers] = useState([]);
  const [mailTarget, setMailTarget] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [mailStatus, setMailStatus] = useState("");
  const [overrideEmail, setOverrideEmail] = useState("");

  // Step 1: Request 2FA Code
  const handleRequest2FA = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_2fa",
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Zugriff verweigert.");
      } else {
        setStep(2);
      }
    } catch (err) {
      setError("Verbindungsfehler: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 2FA
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_2fa",
          email: email.trim(),
          code: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Ungültiger 2FA-Code.");
      } else {
        setUsers(data.users || []);
        setStep(3);
      }
    } catch (err) {
      setError("Fehler: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Plan
  const handleUpdatePlan = async (userEmail, newTier) => {
    try {
      const res = await fetch("/api/admin-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_user_plan",
          email: userEmail,
          newTier: newTier,
          masterPassword: password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local list
        setUsers((prev) =>
          prev.map((u) => (u.email === userEmail ? { ...u, tier: newTier } : u))
        );
      }
    } catch (err) {
      alert("Fehler beim Aktualisieren: " + err.message);
    }
  };

  // Ban or Unban User
  const handleToggleBan = async (userEmail, isCurrentlyBanned) => {
    const actionName = isCurrentlyBanned ? "entsperren" : "bannen";
    if (!confirm(`Möchtest du ${userEmail} wirklich ${actionName}?`)) return;

    try {
      const res = await fetch("/api/admin-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_ban_user",
          email: userEmail,
          isBanned: !isCurrentlyBanned,
          masterPassword: password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.email === userEmail ? { ...u, tier: !isCurrentlyBanned ? "Banned" : "Free" } : u
          )
        );
      }
    } catch (err) {
      alert("Fehler beim Bannen: " + err.message);
    }
  };

  // Send Direct Email via Resend
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setMailStatus("Wird gesendet...");

    try {
      const res = await fetch("/api/admin-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_client_email",
          targetEmail: mailTarget,
          subject: mailSubject,
          message: mailBody,
          masterPassword: password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMailStatus("✅ E-Mail erfolgreich via Resend versendet!");
        setMailBody("");
      } else {
        setMailStatus("❌ Fehler: " + data.error);
      }
    } catch (err) {
      setMailStatus("❌ Fehler: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans p-6 md:p-12">
      {/* Step 1: Login */}
      {step === 1 && (
        <div className="max-w-md mx-auto mt-20 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-orange-500/30">
              🔒
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">LearnLock Master Access</h1>
            <p className="text-sm text-slate-400 mt-1">Nur für autorisierte Administratoren</p>
          </div>

          <form onSubmit={handleRequest2FA} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin E-Mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Master Passwort</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            {error && <p className="text-xs text-rose-400 text-center font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-orange-500 hover:bg-orange-600 font-bold rounded-xl text-white transition shadow-lg shadow-orange-500/25 disabled:opacity-50"
            >
              {loading ? "Wird geprüft..." : "2FA-Sicherheitscode anfordern"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: 2FA Verification */}
      {step === 2 && (
        <div className="max-w-md mx-auto mt-20 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-cyan-500/30">
              🔐
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">2-Faktor-Verifizierung</h1>
            <p className="text-sm text-slate-400 mt-1">
              Wir haben einen 6-stelligen Code an <strong>{email}</strong> gesendet.
            </p>
          </div>

          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">6-Stelliger Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full mt-1.5 px-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-center text-2xl tracking-[8px] font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {error && <p className="text-xs text-rose-400 text-center font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl text-white transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {loading ? "Wird verifiziert..." : "Code bestätigen & Einloggen"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-slate-500 hover:text-slate-300 transition text-center pt-2"
            >
              ← Zurück zum Login
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Global Admin Dashboard */}
      {step === 3 && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <h1 className="text-2xl font-bold text-white tracking-tight">LearnLock Master Control</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE CLOUD CONNECTED
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Globale Live-Kundenverwaltung, Lizenz-Steuerung &amp; E-Mail-Kommunikation</p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700 transition"
            >
              Abmelden
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: User List */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Registrierte Kunden &amp; Abonnements ({users.length})</h2>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>Keine Kunden in der Cloud-Datenbank gefunden.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((u) => (
                    <div
                      key={u.id || u.email}
                      className="p-4 bg-slate-800/60 border border-slate-750 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{u.email}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              u.tier === "Ultra" || u.tier === "Lifetime"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : u.tier === "Pro"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {u.tier || "Free"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Profile: {u.children?.length || 0} Kinder
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {u.tier === "Banned" ? (
                          <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg">
                            🚫 GEBANNT
                          </span>
                        ) : null}

                        <button
                          onClick={() => handleUpdatePlan(u.email, "Ultra")}
                          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition shadow"
                        >
                          👑 Lifetime
                        </button>
                        <button
                          onClick={() => handleUpdatePlan(u.email, "Free")}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition"
                        >
                          ❌ Free
                        </button>
                        <button
                          onClick={() => handleToggleBan(u.email, u.tier === "Banned")}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                            u.tier === "Banned"
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                              : "bg-red-600 hover:bg-red-500 text-white"
                          }`}
                        >
                          {u.tier === "Banned" ? "Entbannen" : "🚫 Bann"}
                        </button>
                        <button
                          onClick={() => {
                            setMailTarget(u.email);
                          }}
                          className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-semibold rounded-lg border border-blue-500/30 transition"
                        >
                          ✉️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Email Composer & Override */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Mail Form */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white mb-4">✉️ Kunden-Nachricht senden (Resend)</h2>
                <form onSubmit={handleSendEmail} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Empfänger-E-Mail</label>
                    <input
                      type="email"
                      required
                      placeholder="kunde@domain.de"
                      value={mailTarget}
                      onChange={(e) => setMailTarget(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400">Betreff</label>
                    <input
                      type="text"
                      required
                      placeholder="Wichtige Mitteilung zu deinem LearnLock Plan"
                      value={mailSubject}
                      onChange={(e) => setMailSubject(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400">Nachrichtentext</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Hallo, wir haben dein Konto überprüft..."
                      value={mailBody}
                      onChange={(e) => setMailBody(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {mailStatus && <p className="text-xs text-center font-medium">{mailStatus}</p>}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow"
                  >
                    🚀 E-Mail jetzt senden
                  </button>
                </form>
              </div>

              {/* Direct Plan Override */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white mb-2">⚡ Manueller Lizenz-Override</h2>
                <p className="text-xs text-slate-400 mb-4">Schalte beliebig jede E-Mail-Adresse sofort auf Lifetime oder Free.</p>
                
                <input
                  type="email"
                  placeholder="beliebige@email.de"
                  value={overrideEmail}
                  onChange={(e) => setOverrideEmail(e.target.value)}
                  className="w-full mb-3 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      if (overrideEmail) handleUpdatePlan(overrideEmail, "Ultra");
                    }}
                    className="py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition"
                  >
                    👑 Lifetime
                  </button>
                  <button
                    onClick={() => {
                      if (overrideEmail) handleUpdatePlan(overrideEmail, "Free");
                    }}
                    className="py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition"
                  >
                    ❌ Free
                  </button>
                  <button
                    onClick={() => {
                      if (overrideEmail) handleToggleBan(overrideEmail, false);
                    }}
                    className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    🚫 Bannen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
