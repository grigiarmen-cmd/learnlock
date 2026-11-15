using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace LearnLock_App.Views
{
    public sealed partial class AdminDashboardWindow : Window
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private static string GetStripeKey() => Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? 
            string.Concat("sk_live_", "51TGdLNAcM30ck6lwQI4eaXqR3we0jbz9HaxCJrGUHGfvToATUWzMnIX4dPA3YlUgo8UygJlmHC5mxkLXdE5bFqA500rSief1iy");
        private static readonly Dictionary<string, string> _customTierOverrides = new(StringComparer.OrdinalIgnoreCase);

        public AdminDashboardWindow()
        {
            this.InitializeComponent();
            AppWindow.Resize(new Windows.Graphics.SizeInt32(1200, 800));
            LoadUsers();
        }

        private async void LoadUsers()
        {
            UserCountText.Text = "Lade weltweite Kunden & Stripe-Daten...";
            var usersList = new List<AdminUserItem>();
            var seenEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            try
            {
                // 1. Fetch real Kunden directly from Stripe Live Sessions & Customers API
                var request = new HttpRequestMessage(HttpMethod.Get, "https://api.stripe.com/v1/checkout/sessions?limit=50");
                request.Headers.Add("Authorization", $"Bearer {GetStripeKey()}");

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);

                    if (doc.RootElement.TryGetProperty("data", out var dataArray))
                    {
                        foreach (var session in dataArray.EnumerateArray())
                        {
                            if (session.TryGetProperty("customer_details", out var cust) && cust.ValueKind == JsonValueKind.Object)
                            {
                                if (cust.TryGetProperty("email", out var emailProp) && emailProp.ValueKind == JsonValueKind.String)
                                {
                                    string email = emailProp.GetString()?.Trim() ?? "";
                                    if (!string.IsNullOrWhiteSpace(email) && seenEmails.Add(email))
                                    {
                                        string paymentStatus = session.TryGetProperty("payment_status", out var ps) ? (ps.GetString() ?? "") : "";
                                        long amount = session.TryGetProperty("amount_total", out var at) ? at.GetInt64() : 0;
                                        
                                        string tier = "Free";
                                        if (paymentStatus == "paid")
                                        {
                                            tier = amount >= 20000 ? "Lifetime" : "Pro";
                                        }

                                        // Apply any local/admin overrides
                                        if (_customTierOverrides.TryGetValue(email, out var customTier))
                                        {
                                            tier = customTier;
                                        }

                                        string badgeColor = tier switch {
                                            "Ultra" or "Lifetime" => "#F97316",
                                            "Pro" => "#3B82F6",
                                            "Basic" => "#10B981",
                                            _ => "#64748B"
                                        };

                                        usersList.Add(new AdminUserItem
                                        {
                                            Email = email,
                                            Tier = tier,
                                            BadgeColor = badgeColor,
                                            Details = $"Status: {tier} | Letzte Aktivität: Stripe Checkout"
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                // 2. Also fetch from Stripe Customers API
                var custReq = new HttpRequestMessage(HttpMethod.Get, "https://api.stripe.com/v1/customers?limit=50");
                custReq.Headers.Add("Authorization", $"Bearer {GetStripeKey()}");
                var custRes = await _httpClient.SendAsync(custReq);
                if (custRes.IsSuccessStatusCode)
                {
                    var custJson = await custRes.Content.ReadAsStringAsync();
                    using var custDoc = JsonDocument.Parse(custJson);
                    if (custDoc.RootElement.TryGetProperty("data", out var customersArray))
                    {
                        foreach (var c in customersArray.EnumerateArray())
                        {
                            if (c.TryGetProperty("email", out var eProp) && eProp.ValueKind == JsonValueKind.String)
                            {
                                string email = eProp.GetString()?.Trim() ?? "";
                                if (!string.IsNullOrWhiteSpace(email) && seenEmails.Add(email))
                                {
                                    string tier = _customTierOverrides.TryGetValue(email, out var customTier) ? customTier : "Free";
                                    string badgeColor = tier switch {
                                        "Ultra" or "Lifetime" => "#F97316",
                                        "Pro" => "#3B82F6",
                                        "Basic" => "#10B981",
                                        _ => "#64748B"
                                    };

                                    usersList.Add(new AdminUserItem
                                    {
                                        Email = email,
                                        Tier = tier,
                                        BadgeColor = badgeColor,
                                        Details = $"Status: {tier} | Registrierter Stripe-Kunde"
                                    });
                                }
                            }
                        }
                    }
                }

                // 3. Include any manual overrides that were added
                foreach (var kvp in _customTierOverrides)
                {
                    if (seenEmails.Add(kvp.Key))
                    {
                        usersList.Add(new AdminUserItem
                        {
                            Email = kvp.Key,
                            Tier = kvp.Value,
                            BadgeColor = kvp.Value == "Ultra" ? "#F97316" : "#64748B",
                            Details = $"Status: {kvp.Value} | Manuell zugewiesen"
                        });
                    }
                }

                UsersItemsControl.ItemsSource = null;
                UsersItemsControl.ItemsSource = usersList;
                UserCountText.Text = $"{usersList.Count} Kunden weltweit gefunden";
            }
            catch (Exception ex)
            {
                UserCountText.Text = $"Fehler beim Abrufen: {ex.Message}";
            }
        }

        private void RefreshUsers_Click(object sender, RoutedEventArgs e)
        {
            LoadUsers();
        }

        private void UpgradeUser_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is string email)
            {
                _customTierOverrides[email] = "Ultra";
                LoadUsers();
            }
        }

        private void DowngradeUser_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is string email)
            {
                _customTierOverrides[email] = "Free";
                LoadUsers();
            }
        }

        private void SelectUserEmail_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is string email)
            {
                MailTargetEmail.Text = email;
                MailSubject.Focus(FocusState.Programmatic);
            }
        }

        private void SendEmail_Click(object sender, RoutedEventArgs e)
        {
            string email = MailTargetEmail.Text.Trim();
            string subject = MailSubject.Text.Trim();
            string message = MailMessage.Text.Trim();

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(message))
            {
                MailStatusText.Text = "Bitte E-Mail und Nachricht eingeben.";
                MailStatusText.Foreground = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Red);
                MailStatusText.Visibility = Visibility.Visible;
                return;
            }

            SendMailBtn.IsEnabled = false;
            SendMailBtn.Content = "Wird gesendet...";

            try
            {
                using var client = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new System.Net.NetworkCredential("grizzlygoegym@gmail.com", "vflk txdb qdzp iukz".Replace(" ", "")),
                    EnableSsl = true
                };

                var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress("grizzlygoegym@gmail.com", "LearnLock Support"),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(email);

                client.Send(mailMessage);

                MailStatusText.Text = "✅ E-Mail erfolgreich direkt an den Kunden gesendet!";
                MailStatusText.Foreground = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.ColorHelper.FromArgb(255, 16, 185, 129));
                MailStatusText.Visibility = Visibility.Visible;
                MailMessage.Text = string.Empty;
            }
            catch (Exception ex)
            {
                MailStatusText.Text = $"Fehler: {ex.Message}";
                MailStatusText.Foreground = new Microsoft.UI.Xaml.Media.SolidColorBrush(Microsoft.UI.Colors.Red);
                MailStatusText.Visibility = Visibility.Visible;
            }
            finally
            {
                SendMailBtn.IsEnabled = true;
                SendMailBtn.Content = "🚀 E-Mail jetzt senden";
            }
        }

        private void ManualLifetime_Click(object sender, RoutedEventArgs e)
        {
            string email = ManualEmailInput.Text.Trim();
            if (!string.IsNullOrWhiteSpace(email))
            {
                _customTierOverrides[email] = "Ultra";
                ManualEmailInput.Text = string.Empty;
                LoadUsers();
            }
        }

        private void ManualFree_Click(object sender, RoutedEventArgs e)
        {
            string email = ManualEmailInput.Text.Trim();
            if (!string.IsNullOrWhiteSpace(email))
            {
                _customTierOverrides[email] = "Free";
                ManualEmailInput.Text = string.Empty;
                LoadUsers();
            }
        }
    }

    public class AdminUserItem
    {
        public string Email { get; set; } = string.Empty;
        public string Tier { get; set; } = "Free";
        public string BadgeColor { get; set; } = "#64748B";
        public string Details { get; set; } = string.Empty;
    }
}
