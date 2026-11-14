using System;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Models;
using LearnLock.Core.Services;

namespace LearnLock_App.Views
{
    public sealed partial class ChildView : Page
    {
        private readonly ITimerService _timerService;
        private readonly IAuthService _authService;
        private ChildProfile _child = null!;

        public ChildView()
        {
            this.InitializeComponent();
            _timerService = App.Services.GetRequiredService<ITimerService>();
            _authService = App.Services.GetRequiredService<IAuthService>();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            if (e.Parameter is ChildProfile child)
            {
                _child = child;
                
                // Hook countdown event handlers
                _timerService.TimeUpdated += TimerService_TimeUpdated;
                _timerService.TimeExpired += TimerService_TimeExpired;

                // If balance is 0 or uninitialized, ensure we start lock screen or clean balance
                int startSeconds = _child.CurrentTimeBalanceSeconds > 0 ? _child.CurrentTimeBalanceSeconds : 0;
                _timerService.Start(_child.Id, startSeconds);
                UpdateTimerText(_timerService.CurrentTimeSeconds);

                if (startSeconds <= 0)
                {
                    // No playtime available, lock immediately
                    var lockWindow = new LockScreenWindow(_child);
                    lockWindow.Activate();
                    App.MainWindowInstance?.HideWindow();
                }
            }
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            // Unhook event handlers
            _timerService.TimeUpdated -= TimerService_TimeUpdated;
            _timerService.TimeExpired -= TimerService_TimeExpired;
            _timerService.Stop();
        }

        private void TimerService_TimeUpdated(int remainingSeconds)
        {
            DispatcherQueue.TryEnqueue(() =>
            {
                UpdateTimerText(remainingSeconds);

                // Keep persisting the current time balance to db periodically
                if (remainingSeconds % 10 == 0)
                {
                    PersistTimeBalance(remainingSeconds);
                }
            });
        }

        private async void PersistTimeBalance(int balance)
        {
            try
            {
                _child.CurrentTimeBalanceSeconds = balance;
                await _authService.UpdateChildAsync(_child);
            }
            catch { }
        }

        private void TimerService_TimeExpired()
        {
            DispatcherQueue.TryEnqueue(() =>
            {
                PersistTimeBalance(0);

                // Auto lock screen simulating screen lockout
                var lockWindow = new LockScreenWindow(_child);
                lockWindow.Activate();

                App.MainWindowInstance?.HideWindow();
            });
        }

        private void UpdateTimerText(int seconds)
        {
            int min = seconds / 60;
            int sec = seconds % 60;
            TimerText.Text = $"{min:D2}:{sec:D2}";
            
            // Format timer color based on urgency
            if (seconds < 60)
            {
                TimerText.Foreground = new Microsoft.UI.Xaml.Media.SolidColorBrush(Windows.UI.Color.FromArgb(255, 229, 115, 115));
            }
            else
            {
                TimerText.Foreground = new Microsoft.UI.Xaml.Media.SolidColorBrush(Windows.UI.Color.FromArgb(255, 129, 199, 132));
            }
        }

        private void SolveMore_Click(object sender, RoutedEventArgs e)
        {
            // Manually trigger lock screen to accumulate more time balance
            var lockWindow = new LockScreenWindow(_child);
            lockWindow.Activate();
            App.MainWindowInstance?.HideWindow();
        }

        private void LockNow_Click(object sender, RoutedEventArgs e)
        {
            _timerService.Stop();
            PersistTimeBalance(0);

            var lockWindow = new LockScreenWindow(_child);
            lockWindow.Activate();
            App.MainWindowInstance?.HideWindow();
        }
    }
}
