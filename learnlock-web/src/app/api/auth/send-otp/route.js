import { NextResponse } from "next/server";

// Simple in-memory rate limiter (Map of IP -> array of timestamps)
const rateLimitMap = new Map();

// Helper to check rate limit (Max 3 emails per 5 minutes per IP)
function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes
    const limit = 3; // Max 3 requests per window

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, [now]);
        return false;
    }

    const timestamps = rateLimitMap.get(ip);
    // Filter timestamps to only those within the window
    const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (recentTimestamps.length >= limit) {
        // Update the map anyway to keep their oldest attempt
        rateLimitMap.set(ip, recentTimestamps);
        return true;
    }

    recentTimestamps.push(now);
    rateLimitMap.set(ip, recentTimestamps);
    return false;
}

export async function POST(req) {
    try {
        // Get IP from headers (works on Vercel, standard proxies)
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
        
        // 1. Check Rate Limit
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: "Too Many Requests. Bitte warte ein paar Minuten." }, 
                { status: 429 }
            );
        }

        const body = await req.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
        }

        // 2. Secret Key from Server ENV (Hacker can't see this)
        const resendApiKey = process.env.RESEND_API_KEY;
        
        if (!resendApiKey) {
            console.error("SERVER ERROR: RESEND_API_KEY is missing in environment variables.");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // 3. Send via Resend API securely from backend
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "LearnLock <onboarding@resend.dev>",
                to: email,
                subject: "Dein LearnLock Eltern-Code",
                html: `<p>Dein Einmalcode für den Elternbereich lautet: <strong style="font-size: 24px;">${code}</strong></p>
                       <br/><p><small>Sicherer Versand via LearnLock Auth-Proxy.</small></p>`
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Resend API Error:", errorData);
            return NextResponse.json({ error: "Email failed to send." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Email sent securely." }, { status: 200 });

    } catch (error) {
        console.error("OTP API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
