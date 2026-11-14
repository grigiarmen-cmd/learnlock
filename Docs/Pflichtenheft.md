# Pflichtenheft: LearnLock

## 1. Zielsetzung
LearnLock ist eine Desktop-Anwendung für Windows, die den Zugang zum Computer (Bildschirmzeit) für Kinder einschränkt. Die Bildschirmsperre kann nur durch das erfolgreiche Lösen von schulischen Aufgaben (Mathematik, Sprachen, Naturwissenschaften) temporär aufgehoben werden.

## 2. Zielgruppe
- **Eltern:** Administratoren der Software, die Profile anlegen, Limits verwalten, Abonnements buchen und Auswertungen einsehen möchten.
- **Kinder (Klassen 1–13):** Nutzer, deren Bildschirmzeit eingeschränkt wird und die durch das Lösen von Aufgaben (Gamification) Spielzeit verdienen.

## 3. Funktionsumfang (Features)

### 3.1. Elternbereich & Verwaltung (StayFree-Dashboard)
- **Registrierung & Authentifizierung:** Registrierung via E-Mail (Resend API OTP) und einem sicheren Eltern-Passwort.
- **Dashboard-Metriken:** Anzeige der Gesamtnutzungszeit, des täglichen Durchschnitts und der aktiven App-Limits.
- **Aktivitätsverlauf:** Wöchentliches Balkendiagramm der Bildschirmnutzung.
- **Meistgenutzte Apps:** Fortschrittsbalken und Nutzungsdauer der Top-Anwendungen (z. B. Discord, Browser, Spiele).
- **Kinderprofil-Verwaltung:**
  - Anlegen, Bearbeiten und Löschen von Kinderprofilen.
  - Festlegen von Namen, Klassenstufe (1-13) und Schwierigkeitsgrad.
  - Definition eines maximalen täglichen Zeitlimits (in Minuten).
  - Auswahl der erlaubten Fächer (Mathematik, Deutsch, Englisch, Biologie, Chemie, Französisch, Spanisch, Religion, Sport).

### 3.2. Abonnement-Modelle (Tiers)
- **Free Tier (Kostenlos):** Maximal 1 Fach (Mathematik), keine erweiterten Filter.
- **Basic (9,99 €/Monat):** Bis zu 5 wählbare Fächer, Basis-Filter für Anwendungen.
- **Pro (25,99 €/Monat):** Bis zu 10 Fächer, starke Anwendungsfilter, KI-Korrekturhilfe.
- **Ultra (44,99 €/Monat):** Alle Fächer unbegrenzt, erweiterte KI-Unterstützung und detaillierte Statistiken.

### 3.3. Sperr-Logik & Aufgaben-Interface
- **Systemweiter Lock-Screen:** Blockiert das System beim Windows-Start oder Ablauf der Spielzeit vollständig (Alt+F4-Blockade, ständiger Fokus, Multi-Monitor-Blackout).
- **Entsperrung durch Aufgaben:** Um 15 Minuten Spielzeit zu verdienen, müssen exakt 20 Aufgaben nacheinander korrekt gelöst werden.
- **Aufgabengenerierung (dynamisch):**
  - Mathematik: Dynamische Rechnungen inkl. Exponenten für höhere Stufen.
  - Andere Fächer: Multiple-Choice-Wissensfragen passend zur gewählten Klassenstufe.
- **Eltern-Override:** Der Sperrbildschirm kann jederzeit mit dem Eltern-Passwort manuell entsperrt werden.

### 3.4. Spielzeit-Dashboard (Kinderansicht)
- Zeigt die verbleibende Restzeit an (Countdown-Timer).
- Möglichkeit, die Sperre freiwillig vorzeitig aufzurufen, um sich zusätzliche Zeit "anzusparen".

## 4. Technische Architektur
- **Framework:** .NET 9, WinUI 3 (Windows App SDK)
- **Architektur-Pattern:** Modulare Klassenbibliotheken (`LearnLock.Core`, `LearnLock.Database`, `LearnLock.Auth`, `LearnLock.Math`, `LearnLock.Timer`, `LearnLock.App`).
- **Datenbank:** Entity Framework Core (SQLite), lokale Datenspeicherung unter `%LocalAppData%\LearnLock\learnlock.db`.
- **Lokalisierung:** Integrierter `LanguageManager` für Englisch und Deutsch.
- **Betriebssystem-Anbindung:** Win32 API Interop (z. B. `SetWindowPos`, `GetForegroundWindow`) zur Erzwingung der absoluten Fenster-Fokussierung auf dem Lock-Screen.

## 5. Systemanforderungen
- **Betriebssystem:** Windows 10 (Build 17763) oder Windows 11.
- **Abhängigkeiten:** WinUI 3 Framework (Self-Contained Deployment möglich) oder .NET 9 Runtime.

## 6. Nicht-funktionale Anforderungen
- **Sicherheit:** Passwörter werden sicher mit PBKDF2 und Salt gehasht. Keine Klartextspeicherung.
- **Stabilität:** Der Lock-Screen darf unter keinen Umständen (außer durch gewaltsames Beenden des Prozesses durch externe Tools) bypassbar sein.
- **UX/UI:** Dunkles "Dark Mode" Design mit modernen Akzentfarben (Violett/Grün) und reaktionsschnellem Feedback.
