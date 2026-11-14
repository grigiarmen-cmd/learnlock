using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Stripe;
using Stripe.Checkout;

namespace LearnLock_App.Services
{
    public class StripePaymentService
    {
        // Stripe keys loaded dynamically or via environment
        private static string StripeSecretKey => Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? "sk_live_PLACEHOLDER";
        private static string StripePublishableKey => Environment.GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY") ?? "pk_live_PLACEHOLDER";

        public StripePaymentService()
        {
            StripeConfiguration.ApiKey = StripeSecretKey;
        }

        public async Task<Session> CreateCheckoutSessionAsync(string planName, bool isYearly, string customerEmail)
        {
            long amountCents = GetPriceInCents(planName, isYearly);
            string interval = isYearly ? "year" : "month";
            string planDescription = isYearly ? $"{planName} (Jahresabo)" : $"{planName} (Monatsabo)";

            var options = new SessionCreateOptions
            {
                CustomerEmail = customerEmail,
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = amountCents,
                            Currency = "eur",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"LearnLock {planDescription}"
                            },
                            Recurring = new SessionLineItemPriceDataRecurringOptions
                            {
                                Interval = interval
                            }
                        },
                        Quantity = 1,
                    },
                },
                Mode = "subscription",
                SuccessUrl = "https://example.com/success?session_id={CHECKOUT_SESSION_ID}", // Dummy URL, we poll API
                CancelUrl = "https://example.com/cancel", // Dummy URL
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
            // Monthly prices: Basic=10, Pro=15, Ultra=25
            // Yearly prices: Basic=79.99, Pro=119.99, Ultra=199.99
            
            if (planName.Equals("Basic", StringComparison.OrdinalIgnoreCase))
            {
                return isYearly ? 7999 : 1000;
            }
            if (planName.Equals("Pro", StringComparison.OrdinalIgnoreCase))
            {
                return isYearly ? 11999 : 1500;
            }
            if (planName.Equals("Ultra", StringComparison.OrdinalIgnoreCase))
            {
                return isYearly ? 19999 : 2500;
            }

            return 0; // Free
        }
    }
}
