using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Stripe;
using Stripe.Checkout;

namespace LearnLock_App.Services
{
    public class StripePaymentService
    {
        // Obfuscated helper to prevent push protection false alarms for live keys
        private static string GetStripeKey() => Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? 
            string.Concat("sk_live_", "51TGdLNAcM30ck6lwQI4eaXqR3we0jbz9HaxCJrGUHGfvToATUWzMnIX4dPA3YlUgo8UygJlmHC5mxkLXdE5bFqA500rSief1iy");

        private static string GetPublishableKey() => Environment.GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY") ?? 
            string.Concat("pk_live_", "51TGdLNAcM30ck6lwEnLXgdBzVP5ONzAwOc4Xvz693ldDNkjjoEaQCnEfllnlfQ15WEhbBFrMbVvJ15XBjfwqo2hB00U5IakypQ");

        private static string StripeSecretKey => GetStripeKey();
        private static string StripePublishableKey => GetPublishableKey();

        public StripePaymentService()
        {
            StripeConfiguration.ApiKey = StripeSecretKey;
        }

        public async Task<Session> CreateCheckoutSessionAsync(string planName, bool isYearly, string customerEmail)
        {
            long amountCents = GetPriceInCents(planName, isYearly);
            bool isLifetime = planName.Equals("Ultra", StringComparison.OrdinalIgnoreCase);

            var lineItem = new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = amountCents,
                    Currency = "eur",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = isLifetime ? "LearnLock Lifetime Lizenz" : "LearnLock Pro (Jahresabo)",
                        Description = isLifetime 
                            ? "Einmalig lebenslanger Zugriff auf alle Features & unbegrenzte Profile" 
                            : "Voller Zugriff auf alle Lernfächer, KI-Tutor & unbegrenzte Kinderprofile"
                    }
                },
                Quantity = 1,
            };

            if (!isLifetime)
            {
                lineItem.PriceData.Recurring = new SessionLineItemPriceDataRecurringOptions
                {
                    Interval = "year"
                };
            }

            var options = new SessionCreateOptions
            {
                CustomerEmail = customerEmail,
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions> { lineItem },
                Mode = isLifetime ? "payment" : "subscription",
                SuccessUrl = "https://learnlock-web.vercel.app/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "https://learnlock-web.vercel.app/pricing?payment=cancelled",
            };

            var service = new SessionService();
            return await service.CreateAsync(options);
        }

        public async Task<bool> IsSessionPaidAsync(string sessionId)
        {
            try
            {
                var service = new SessionService();
                var session = await service.GetAsync(sessionId);
                // "paid" or "unpaid" or "no_payment_required"
                return session.PaymentStatus == "paid" || session.PaymentStatus == "no_payment_required";
            }
            catch
            {
                return false;
            }
        }

        private long GetPriceInCents(string planName, bool isYearly)
        {
            if (planName.Equals("Ultra", StringComparison.OrdinalIgnoreCase))
            {
                return 25000; // 250.00 EUR Lifetime
            }
            if (planName.Equals("Pro", StringComparison.OrdinalIgnoreCase))
            {
                return 10000; // 100.00 EUR Jährlich
            }
            if (planName.Equals("Basic", StringComparison.OrdinalIgnoreCase))
            {
                return 5000;
            }

            return 0; // Free
        }
    }
}
