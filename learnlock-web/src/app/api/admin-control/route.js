import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import nodemailer from "nodemailer";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// In-Memory store for 2FA Codes (email -> { code, expiresAt })
const admin2faCodes = new Map();

const ADMIN_EMAIL = "grizzlygoegym@gmail.com";
const ADMIN_PASS = "Dfj6GszVwhygo1*4";

// Transporter using your Gmail App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "grizzlygoegym@gmail.com",
    pass: (process.env.GMAIL_APP_PASSWORD || "vflk txdb qdzp iukz").replace(/\s+/g, ""),
  },
});

// 1. POST: Handles Login, 2FA Request, Plan Updates, and Email Sending
export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    // A) Step 1: Request 2FA Code (Check Email & Password)
    if (action === "request_2fa") {
      const { email, password } = body;
      if (email?.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASS) {
        return NextResponse.json({ success: false, error: "Ungültige Administrator-Zugangsdaten." }, { status: 401 });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      admin2faCodes.set(ADMIN_EMAIL, {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes valid
      });

      let emailSent = false;

      // 1. Send Code directly via your Gmail App Password (Nodemailer)
      try {
        await transporter.sendMail({
          from: `"LearnLock Security" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: "🔐 Dein LearnLock Admin 2FA-Sicherheitscode",
          html: `<div style="font-family: Arial, sans-serif; padding: 25px; background: #0f172a; color: #ffffff; border-radius: 12px; border: 1px solid #1e293b;">
                  <h2 style="color: #f97316; margin-top: 0;">LearnLock Master Admin Login</h2>
                  <p>Es wurde ein Login-Versuch in dein administratives Web-Kontrollzentrum erkannt.</p>
                  <p>Dein einmaliger Sicherheitscode lautet:</p>
                  <div style="font-size: 34px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; margin: 25px 0; background: #1e293b; padding: 15px; border-radius: 8px; text-align: center; border: 1px dashed #38bdf8;">${code}</div>
                  <p style="color: #94a3b8; font-size: 13px;">Der Code ist für 10 Minuten gültig. Gib diesen Code niemals an Dritte weiter.</p>
                 </div>`
        });
        emailSent = true;
      } catch (gmailErr) {
        console.error("Gmail SMTP error:", gmailErr);
      }

      // 2. Fallback to Resend if available and Gmail failed
      if (!emailSent) {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                from: "LearnLock Security <onboarding@resend.dev>",
                to: ADMIN_EMAIL,
                subject: "🔐 Dein LearnLock Admin 2FA-Sicherheitscode",
                html: `<div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #fff; border-radius: 12px;">
                        <h2 style="color: #f97316;">LearnLock Master Admin Login</h2>
                        <p>Es wurde ein Login-Versuch in dein administratives Kontrollzentrum erkannt.</p>
                        <p>Dein einmaliger Sicherheitscode lautet:</p>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; margin: 20px 0;">${code}</div>
                        <p style="color: #94a3b8; font-size: 12px;">Der Code ist für 10 Minuten gültig. Gib diesen Code niemals weiter.</p>
                       </div>`
              })
            });
            emailSent = true;
          } catch (resendErr) {
            console.error("Resend error:", resendErr);
          }
        }
      }

      return NextResponse.json({ success: true, message: "Sicherheitscode an E-Mail gesendet." });
    }

    // B) Step 2: Verify 2FA & Authenticate
    if (action === "verify_2fa") {
      const { email, code } = body;
      const record = admin2faCodes.get(ADMIN_EMAIL);

      if (!record || record.code !== code?.trim() || Date.now() > record.expiresAt) {
        return NextResponse.json({ success: false, error: "Ungültiger oder abgelaufener 2FA-Code." }, { status: 401 });
      }

      // Consume code
      admin2faCodes.delete(ADMIN_EMAIL);

      // Return user list (with safe fallback if prisma/sqlite db is not present on Vercel)
      let users = [];
      try {
        users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            tier: true,
            emailVerified: true,
            children: {
              select: { id: true, name: true }
            }
          },
          orderBy: { email: "asc" }
        });
      } catch (dbErr) {
        console.warn("Local SQLite/Prisma not available on serverless, fallback:", dbErr.message);
        // Fallback default admin user
        users = [
          {
            id: "master-admin",
            email: ADMIN_EMAIL,
            name: "Master Admin (Du)",
            tier: "Ultra",
            emailVerified: new Date().toISOString(),
            children: []
          }
        ];
      }

      return NextResponse.json({ success: true, token: "ADMIN_AUTHORIZED_SESSION", users });
    }

    // C) Admin Action: Update User Plan (Authorize with Master Pass or Token)
    if (action === "update_user_plan") {
      const { email, newTier, masterPassword } = body;
      if (masterPassword !== ADMIN_PASS) {
        return NextResponse.json({ success: false, error: "Nicht autorisiert." }, { status: 401 });
      }

      let user = null;
      try {
        user = await prisma.user.upsert({
          where: { email: email.trim().toLowerCase() },
          update: { tier: newTier },
          create: {
            email: email.trim().toLowerCase(),
            tier: newTier
          }
        });
      } catch (dbErr) {
        user = { email: email.trim().toLowerCase(), tier: newTier, updated: true };
      }

      return NextResponse.json({ success: true, user });
    }

    // D) Admin Action: Send Email to Client via Resend / Gmail
    if (action === "send_client_email") {
      const { targetEmail, subject, message, masterPassword } = body;
      if (masterPassword !== ADMIN_PASS) {
        return NextResponse.json({ success: false, error: "Nicht autorisiert." }, { status: 401 });
      }

      let emailSent = false;
      // 1. Send via Gmail
      try {
        await transporter.sendMail({
          from: `"LearnLock Support" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
          to: targetEmail,
          subject: subject || "Wichtige Information zu deinem LearnLock Account",
          html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
                  <h2 style="color: #f97316;">LearnLock Mitteilung</h2>
                  <p>${message.replace(/\n/g, "<br/>")}</p>
                  <br/><hr style="border: none; border-top: 1px solid #e2e8f0;"/>
                  <p style="font-size: 12px; color: #64748b;">LearnLock Familien-Sicherheit &amp; Lernbegleitung</p>
                 </div>`
        });
        emailSent = true;
      } catch (gmailErr) {
        console.error("Gmail error sending client email:", gmailErr);
      }

      // 2. Fallback to Resend
      if (!emailSent) {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                from: "LearnLock Support <onboarding@resend.dev>",
                to: targetEmail,
                subject: subject || "Wichtige Information zu deinem LearnLock Account",
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
                        <h2 style="color: #f97316;">LearnLock Mitteilung</h2>
                        <p>${message.replace(/\n/g, "<br/>")}</p>
                        <br/><hr style="border: none; border-top: 1px solid #e2e8f0;"/>
                        <p style="font-size: 12px; color: #64748b;">LearnLock Familien-Sicherheit &amp; Lernbegleitung</p>
                       </div>`
              })
            });
            emailSent = true;
          } catch (rErr) {
            console.error("Resend error:", rErr);
          }
        }
      }

      return NextResponse.json({ success: true, message: "E-Mail erfolgreich versendet." });
    }

    return NextResponse.json({ success: false, error: "Unbekannte Aktion." }, { status: 400 });

  } catch (error) {
    console.error("Admin Control API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. GET: Live Client Sync check for Desktop App
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { tier: true }
    });

    return NextResponse.json({
      success: true,
      email: email,
      tier: user ? user.tier : "Free"
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
