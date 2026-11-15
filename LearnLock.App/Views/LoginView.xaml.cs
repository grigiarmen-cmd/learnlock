using System;
using System.Collections.Generic;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Navigation;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Models;
using LearnLock.Core.Services;

namespace LearnLock_App.Views
{
    public sealed partial class LoginView : Page
    {
        private IAuthService _authService = null!;
        private string? _currentOtpCode;

        public LoginView()
        {
            this.InitializeComponent();
            _authService = App.Services.GetRequiredService<IAuthService>();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            ParentPasswordInput.Password = string.Empty;
            LoginErrorText.Visibility = Visibility.Collapsed;

            // Setup language combo selection without triggering selection changed event
            LanguageComboBox.SelectionChanged -= LanguageComboBox_SelectionChanged;
            string currentLang = LanguageManager.CurrentLanguage;
            if (currentLang.StartsWith("de", StringComparison.OrdinalIgnoreCase))
            {
                LanguageComboBox.SelectedIndex = 0;
            }
            else
            {
                LanguageComboBox.SelectedIndex = 1;
            }
            LanguageComboBox.SelectionChanged += LanguageComboBox_SelectionChanged;

            LocalizeStrings();
            RefreshChildrenDisplay();
        }

        private void LanguageComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (LanguageComboBox.SelectedItem is ComboBoxItem item && item.Tag is string langCode)
            {
                LanguageManager.SetLanguage(langCode);
                LocalizeStrings();
                RefreshChildrenDisplay();
            }
        }

        private void LocalizeStrings()
        {
            WhoIsLearningText.Text = LanguageManager.GetString("WhoIsLearning");
            ParentAreaText.Text = LanguageManager.GetString("ParentArea");
            LoginButton.Content = LanguageManager.GetString("LoginBtn");
            ParentPasswordInput.PlaceholderText = LanguageManager.GetString("ParentPasswordPlaceholder");
        }

        private async void RefreshChildrenDisplay()
        {
            try
            {
                var children = await _authService.GetChildrenAsync();
                if (children == null || children.Count == 0)
                {
                    NoChildrenText.Text = LanguageManager.GetString("NoChildrenText");
                    NoChildrenText.Visibility = Visibility.Visible;
                    ChildrenGrid.Visibility = Visibility.Collapsed;
                    ChildrenGrid.ItemsSource = null;
                }
                else
                {
                    NoChildrenText.Visibility = Visibility.Collapsed;
                    ChildrenGrid.Visibility = Visibility.Visible;
                    ChildrenGrid.ItemsSource = children;
                }
            }
            catch
            {
                NoChildrenText.Text = LanguageManager.GetString("ErrorLoadingProfiles");
                NoChildrenText.Visibility = Visibility.Visible;
                ChildrenGrid.Visibility = Visibility.Collapsed;
            }
        }

        private async void ParentLogin_Click(object sender, RoutedEventArgs e)
        {
            LoginErrorText.Visibility = Visibility.Collapsed;
            string password = ParentPasswordInput.Password;

            if (string.IsNullOrEmpty(password))
            {
                ShowLoginError(LanguageManager.GetString("PleaseEnterPassword"));
                return;
            }

            bool authenticated = await _authService.VerifyParentPasswordAsync(password);
            if (authenticated)
            {
                App.MainWindowInstance?.ShowAndNavigate(typeof(ParentView));
            }
            else
            {
                ShowLoginError(LanguageManager.GetString("InvalidPassword"));
            }
        }

        private void ParentPasswordInput_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == Windows.System.VirtualKey.Enter)
            {
                ParentLogin_Click(sender, new RoutedEventArgs());
            }
        }

        private void ChildrenGrid_ItemClick(object sender, ItemClickEventArgs e)
        {
            if (e.ClickedItem is ChildProfile child)
            {
                Frame.Navigate(typeof(ChildView), child);
            }
        }

        private void ShowLoginError(string message)
        {
            LoginErrorText.Text = message;
            LoginErrorText.Visibility = Visibility.Visible;
        }

        private void SwitchToPasswordLogin_Click(object sender, RoutedEventArgs e)
        {
            LoginErrorText.Visibility = Visibility.Collapsed;
            ResetPasswordPanel.Visibility = Visibility.Collapsed;
            PasswordLoginPanel.Visibility = Visibility.Visible;
        }

        private async void SwitchToResetPassword_Click(object sender, RoutedEventArgs e)
        {
            LoginErrorText.Visibility = Visibility.Collapsed;
            PasswordLoginPanel.Visibility = Visibility.Collapsed;
            ResetPasswordPanel.Visibility = Visibility.Visible;
            ResetFormFields.Visibility = Visibility.Collapsed;

            try
            {
                var parent = await _authService.GetParentProfileAsync();
                if (parent != null && !string.IsNullOrWhiteSpace(parent.Email))
                {
                    ResetEmailInput.Text = parent.Email;
                }
            }
            catch { }
        }

        private async void SendResetCode_Click(object sender, RoutedEventArgs e)
        {
            LoginErrorText.Visibility = Visibility.Collapsed;
            string email = ResetEmailInput.Text.Trim();

            if (string.IsNullOrWhiteSpace(email))
            {
                ShowLoginError("Bitte geben Sie Ihre Eltern-E-Mail-Adresse ein.");
                return;
            }

            _currentOtpCode = Random.Shared.Next(100000, 1000000).ToString();
            SendResetCodeButton.IsEnabled = false;
            SendResetCodeButton.Content = "Code wird gesendet...";

            try
            {
                bool success = await _authService.SendPasswordResetCodeAsync(email, _currentOtpCode);
                if (success)
                {
                    ResetFormFields.Visibility = Visibility.Visible;
                    SendResetCodeButton.Content = "✅ Code gesendet!";
                }
                else
                {
                    SendResetCodeButton.IsEnabled = true;
                    SendResetCodeButton.Content = "Sicherheitscode per E-Mail anfordern";
                    ShowLoginError("❌ E-Mail konnte nicht gesendet werden. Bitte prüfen Sie Ihre Internetverbindung.");
                }
            }
            catch (Exception ex)
            {
                SendResetCodeButton.IsEnabled = true;
                SendResetCodeButton.Content = "Sicherheitscode per E-Mail anfordern";
                ShowLoginError($"Fehler beim Code-Versand: {ex.Message}");
            }
        }

        private async void ConfirmResetPassword_Click(object sender, RoutedEventArgs e)
        {
            LoginErrorText.Visibility = Visibility.Collapsed;
            string code = ResetOtpInput.Text.Trim();
            string newPass = ResetNewPasswordInput.Password;
            string confirmPass = ResetConfirmPasswordInput.Password;

            if (string.IsNullOrWhiteSpace(code))
            {
                ShowLoginError("Bitte geben Sie den Sicherheitscode ein.");
                return;
            }

            if (_currentOtpCode == null || code != _currentOtpCode)
            {
                ShowLoginError("Ungültiger oder abgelaufener Sicherheitscode.");
                return;
            }

            if (string.IsNullOrWhiteSpace(newPass) || newPass.Length < 4)
            {
                ShowLoginError("Das neue Passwort muss mindestens 4 Zeichen lang sein.");
                return;
            }

            if (newPass != confirmPass)
            {
                ShowLoginError("Die eingegebenen Passwörter stimmen nicht überein.");
                return;
            }

            try
            {
                bool success = await _authService.ResetParentPasswordAsync(newPass);
                if (success)
                {
                    // Navigate directly to parent area
                    App.MainWindowInstance?.ShowAndNavigate(typeof(ParentView));
                }
                else
                {
                    ShowLoginError("Passwort konnte nicht zurückgesetzt werden.");
                }
            }
            catch (Exception ex)
            {
                ShowLoginError($"Fehler beim Zurücksetzen: {ex.Message}");
            }
        }

        private void ToggleParentDashboard_Click(object sender, RoutedEventArgs e)
        {
            if (ParentLoginPanel.Visibility == Visibility.Visible)
            {
                ParentLoginPanel.Visibility = Visibility.Collapsed;
                ChildProfilesPanel.Visibility = Visibility.Visible;
                ParentDashboardButton.Content = "⚙️ Elternbereich";
            }
            else
            {
                ChildProfilesPanel.Visibility = Visibility.Collapsed;
                ParentLoginPanel.Visibility = Visibility.Visible;
                ParentDashboardButton.Content = "👦 Kinderprofile";
            }
        }

        #region 🔐 Secret Master Admin Trigger & 2FA Login
        private void Page_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            // Check for secret key combination: Ctrl + Alt + A
            var ctrlState = Microsoft.UI.Input.InputKeyboardSource.GetKeyStateForCurrentThread(Windows.System.VirtualKey.Control);
            var altState = Microsoft.UI.Input.InputKeyboardSource.GetKeyStateForCurrentThread(Windows.System.VirtualKey.Menu);

            bool isCtrlDown = (ctrlState & Windows.UI.Core.CoreVirtualKeyStates.Down) == Windows.UI.Core.CoreVirtualKeyStates.Down;
            bool isAltDown = (altState & Windows.UI.Core.CoreVirtualKeyStates.Down) == Windows.UI.Core.CoreVirtualKeyStates.Down;

            if (isCtrlDown && isAltDown && e.Key == Windows.System.VirtualKey.A)
            {
                e.Handled = true;
                OpenAdminLoginModal();
            }
        }

        private void OpenAdminLoginModal()
        {
            AdminErrorText.Visibility = Visibility.Collapsed;
            AdminStep1Panel.Visibility = Visibility.Visible;
            AdminStep2Panel.Visibility = Visibility.Collapsed;
            AdminEmailInput.Text = "grizzlygoegym@gmail.com";
            AdminPasswordInput.Password = string.Empty;
            AdminOtpInput.Text = string.Empty;
            AdminSecretOverlay.Visibility = Visibility.Visible;
        }

        private void AdminCancel_Click(object sender, RoutedEventArgs e)
        {
            AdminSecretOverlay.Visibility = Visibility.Collapsed;
        }

        private string? _adminGenerated2faCode;
        private DateTime _admin2faCodeExpires;

        private async void AdminSendCode_Click(object sender, RoutedEventArgs e)
        {
            AdminErrorText.Visibility = Visibility.Collapsed;
            string email = AdminEmailInput.Text.Trim();
            string password = AdminPasswordInput.Password;

            if (email.ToLowerInvariant() != "grizzlygoegym@gmail.com" || password != "Dfj6GszVwhygo1*4")
            {
                AdminErrorText.Text = "Zugriff verweigert: E-Mail oder Master-Passwort ungültig.";
                AdminErrorText.Visibility = Visibility.Visible;
                return;
            }

            AdminSendCodeBtn.IsEnabled = false;
            AdminSendCodeBtn.Content = "Code wird gesendet...";

            try
            {
                // Generate 6-digit code directly in the app
                _adminGenerated2faCode = Random.Shared.Next(100000, 1000000).ToString();
                _admin2faCodeExpires = DateTime.Now.AddMinutes(10);

                // Send 2FA code directly via SMTP (no localhost dependency!)
                using var client = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new System.Net.NetworkCredential("grizzlygoegym@gmail.com", "vflk txdb qdzp iukz".Replace(" ", "")),
                    EnableSsl = true
                };

                var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress("grizzlygoegym@gmail.com", "LearnLock Security Master"),
                    Subject = "🔐 Dein LearnLock Admin 2FA-Sicherheitscode",
                    Body = $"Hallo Admin,\n\nEs wurde ein Login-Versuch in dein LearnLock Master Command Center erkannt.\n\nDein Sicherheitscode lautet:\n\n{_adminGenerated2faCode}\n\nDer Code ist 10 Minuten gültig. Gib diesen Code niemals weiter.",
                    IsBodyHtml = false
                };
                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);

                AdminStep1Panel.Visibility = Visibility.Collapsed;
                AdminStep2Panel.Visibility = Visibility.Visible;
            }
            catch (Exception ex)
            {
                AdminErrorText.Text = $"E-Mail-Versand fehlgeschlagen: {ex.Message}";
                AdminErrorText.Visibility = Visibility.Visible;
            }
            finally
            {
                AdminSendCodeBtn.IsEnabled = true;
                AdminSendCodeBtn.Content = "2FA-Code an E-Mail anfordern";
            }
        }

        private void AdminVerifyCode_Click(object sender, RoutedEventArgs e)
        {
            AdminErrorText.Visibility = Visibility.Collapsed;
            string code = AdminOtpInput.Text.Trim();

            if (string.IsNullOrWhiteSpace(code))
            {
                AdminErrorText.Text = "Bitte den 6-stelligen Sicherheitscode eingeben.";
                AdminErrorText.Visibility = Visibility.Visible;
                return;
            }

            if (string.IsNullOrEmpty(_adminGenerated2faCode) || code != _adminGenerated2faCode || DateTime.Now > _admin2faCodeExpires)
            {
                AdminErrorText.Text = "Ungültiger oder abgelaufener 2FA-Code.";
                AdminErrorText.Visibility = Visibility.Visible;
                return;
            }

            // Consume code
            _adminGenerated2faCode = null;
            AdminSecretOverlay.Visibility = Visibility.Collapsed;

            // Open Master Command Center Window
            App.MainWindowInstance?.PauseLockForAdmin();
            var adminWindow = new AdminDashboardWindow();
            adminWindow.Closed += (s, args) =>
            {
                App.MainWindowInstance?.ResumeLockAfterAdmin();
            };
            adminWindow.Activate();
        }
        #endregion
    }
}
