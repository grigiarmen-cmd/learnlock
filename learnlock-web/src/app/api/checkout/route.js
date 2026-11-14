import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan"); // "yearly" or "lifetime"

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe ist noch nicht auf dem Server konfiguriert." },
        { status: 500 }
      );
    }

    const host = request.headers.get("host") || "learnlock.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    let lineItem;
    let mode;

    if (plan === "lifetime") {
      // 250 € Lifetime (One-time payment)
      lineItem = {
        price_data: {
          currency: "eur",
          product_data: {
            name: "LearnLock Lifetime Lizenz",
            description: "Einmalig lebenslanger Zugriff auf alle Features & unbegrenzte Profile",
          },
          unit_amount: 25000, // 250.00 EUR in Cents
        },
        quantity: 1,
      };
      mode = "payment";
    } else {
      // 100 € Jährlich (Subscription)
      lineItem = {
        price_data: {
          currency: "eur",
          product_data: {
            name: "LearnLock Pro (Jahresabo)",
            description: "Voller Zugriff auf alle Lernfächer, KI-Tutor & unbegrenzte Kinderprofile",
          },
          unit_amount: 10000, // 100.00 EUR in Cents
          recurring: {
            interval: "year",
          },
        },
        quantity: 1,
      };
      mode = "subscription";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [lineItem],
      mode: mode,
      success_url: `${origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
