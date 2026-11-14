using System;
using System.Threading.Tasks;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Services;

namespace LearnLock_App.Views
{
    public sealed partial class RegistrationView : Page
    {
        private readonly IAuthService _authService;
        private string? _currentOtpCode;
        private string _email = string.Empty;

        public RegistrationView()
        {
            this.InitializeComponent();
            _authService = App.Services.GetRequiredService<IAuthService>();
        }

        private async void SendOtp_Click(object sender, RoutedEventArgs e)
        {
            ErrorText.Visibility = Visibility.Collapsed;
            _email = EmailInput.Text.Trim();

            if (string.IsNullOrWhiteSpace(_email) || !_email.Contains("@"))
            {
                ShowError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
                return;
            }

            _currentOtpCode = Random.Shared.Next(100000, 1000000).ToString();
            SendOtpButton.IsEnabled = false;
            SendOtpButton.Content = "Code wird gesendet...";

            try
            {
                bool success = await _authService.SendOtpCodeAsync(_email, _currentOtpCode);
                if (success)
                {
                    EmailInputPanel.Visibility = Visibility.Collapsed;
                    VerifyOtpPanel.Visibility = Visibility.Visible;
                }
                else
                {
                    ShowError("Fehler beim OTP-Versand. Server oder Backend prüfen.");
                    SendOtpButton.IsEnabled = true;
                    SendOtpButton.Content = "Verifizierungscode senden";
                }
            }
            catch (Exception ex)
            {
                ShowError($"Verbindungsfehler: {ex.Message}");
                SendOtpButton.IsEnabled = true;
                SendOtpButton.Content = "Verifizierungscode senden";
            }
        }

        private void VerifyOtp_Click(object sender, RoutedEventArgs e)
        {
            ErrorText.Visibility = Visibility.Collapsed;
            string code = OtpInput.Text.Trim();

            if (string.IsNullOrWhiteSpace(code))
            {
                ShowError("Bitte geben Sie den Code ein.");
                return;
            }

            if (_currentOtpCode != null && code == _currentOtpCode)
            {
                VerifyOtpPanel.Visibility = Visibility.Collapsed;
                SetPasswordPanel.Visibility = Visibility.Visible;
            }
            else
            {
                ShowError("Ungültiger Verifizierungscode. Bitte versuchen Sie es erneut.");
            }
        }

        private async void CreateAccount_Click(object sender, RoutedEventArgs e)
        {
            ErrorText.Visibility = Visibility.Collapsed;

            string password = PasswordInput.Password;
            string confirm = ConfirmPasswordInput.Password;

            if (string.IsNullOrWhiteSpace(password))
            {
                ShowError("Das Passwort darf nicht leer sein.");
                return;
            }

            if (password.Length < 4)
            {
                ShowError("Das Passwort muss mindestens 4 Zeichen lang sein.");
                return;
            }

            if (password != confirm)
            {
                ShowError("Die Passwörter stimmen nicht überein.");
                return;
            }

            try
            {
                CreateAccountButton.IsEnabled = false;
                CreateAccountButton.Content = "Konto wird eingerichtet...";

                bool registered = await _authService.RegisterParentAsync(password, _email);
                if (registered)
                {
                    Frame.Navigate(typeof(LoginView));
                }
                else
                {
                    ShowError("Konto-Einrichtung fehlgeschlagen.");
                    CreateAccountButton.IsEnabled = true;
                    CreateAccountButton.Content = "Registrierung abschließen";
                }
            }
            catch (Exception ex)
            {
                ShowError($"Fehler beim Speichern des Kontos: {ex.Message}");
                CreateAccountButton.IsEnabled = true;
                CreateAccountButton.Content = "Registrierung abschließen";
            }
        }

        private void ShowError(string message)
        {
            ErrorText.Text = message;
            ErrorText.Visibility = Visibility.Visible;
        }
    }
}
