using System;
using System.Runtime.InteropServices;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Services;
using LearnLock_App.Views;

namespace LearnLock_App
{
    public sealed partial class MainWindow : Window
    {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int x, int y, int cx, int cy, uint uFlags);
        private static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);
        private static readonly IntPtr HWND_NOTOPMOST = new IntPtr(-2);
        private const uint SWP_NOMOVE = 0x0002;
        private const uint SWP_NOSIZE = 0x0001;
        private const uint SWP_SHOWWINDOW = 0x0040;

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        private const int SW_MINIMIZE = 6;

        private DispatcherTimer _lockTimer;

        public MainWindow()
        {
            this.InitializeComponent();
            Title = "LearnLock";

            try
            {
                string iconPath = System.IO.Path.Combine(AppContext.BaseDirectory, "Assets", "AppIcon.ico");
                if (System.IO.File.Exists(iconPath))
                {
                    AppWindow.SetIcon(iconPath);
                }
            }
            catch { }
            
            // Fix hideous title bar styling by customizing colors
            try
            {
                if (Microsoft.UI.Windowing.AppWindowTitleBar.IsCustomizationSupported())
                {
                    var titleBar = AppWindow.TitleBar;
                    titleBar.ExtendsContentIntoTitleBar = true;
                    titleBar.ButtonBackgroundColor = Microsoft.UI.Colors.Transparent;
                    titleBar.ButtonInactiveBackgroundColor = Microsoft.UI.Colors.Transparent;
                    titleBar.ButtonHoverBackgroundColor = Microsoft.UI.ColorHelper.FromArgb(25, 0, 0, 0);
                    titleBar.ButtonHoverForegroundColor = Microsoft.UI.Colors.Black;
                    titleBar.ButtonForegroundColor = Microsoft.UI.Colors.Black;
                }
            }
            catch { }
            
            AppWindow.Closing += AppWindow_Closing;
            
            _lockTimer = new DispatcherTimer();
            _lockTimer.Interval = TimeSpan.FromMilliseconds(200);
            _lockTimer.Tick += (s, e) => EnforceLock();
        }

        private void AppWindow_Closing(Microsoft.UI.Windowing.AppWindow sender, Microsoft.UI.Windowing.AppWindowClosingEventArgs args)
        {
            if (RootFrame.CurrentSourcePageType == typeof(ParentView) || RootFrame.CurrentSourcePageType == typeof(RegistrationView))
            {
                // Parent is logged in or in initial registration -> allow closing
                args.Cancel = false;
                Application.Current.Exit();
            }
            else
            {
                // Child selection / active mode -> prevent closing
                args.Cancel = true;
            }
        }

        private void EnforceLock()
        {
            try
            {
                // Only enforce topmost lock on LoginView (profile chooser) and child pages, NEVER on RegistrationView
                if (RootFrame.CurrentSourcePageType == typeof(LoginView))
                {
                    var hWnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
                    SetWindowPos(hWnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
                }
            }
            catch { }
        }

        private async void RootFrame_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                var authService = App.Services.GetRequiredService<IAuthService>();
                var parent = await authService.GetParentProfileAsync();

                // If protected Windows users are defined, check if current Windows user should be restricted
                string currentWindowsUser = Environment.UserName;
                if (parent != null && !string.IsNullOrWhiteSpace(parent.ProtectedWindowsUsers))
                {
                    var protectedList = parent.ProtectedWindowsUsers
                        .Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(u => u.Trim().ToLowerInvariant())
                        .ToList();

                    // If current Windows user is NOT in the protected list (e.g. Admin himself), allow normal window or do not enforce lock
                    if (!protectedList.Contains(currentWindowsUser.ToLowerInvariant()))
                    {
                        // Current user is an administrator or non-protected account
                        if (await authService.HasParentAccountAsync())
                        {
                            ShowAndNavigate(typeof(LoginView));
                        }
                        else
                        {
                            ShowAndNavigate(typeof(RegistrationView));
                        }
                        return;
                    }
                }

                if (await authService.HasParentAccountAsync())
                {
                    ShowAndNavigate(typeof(LoginView));
                }
                else
                {
                    ShowAndNavigate(typeof(RegistrationView));
                }
            }
            catch
            {
                ShowAndNavigate(typeof(RegistrationView));
            }
        }

        public void ShowAndNavigate(Type pageType, object? parameter = null)
        {
            if (pageType == typeof(ParentView) || pageType == typeof(RegistrationView))
            {
                _lockTimer.Stop();
                AppWindow.SetPresenter(AppWindowPresenterKind.Default);
                var hWnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
                SetWindowPos(hWnd, HWND_NOTOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
                if (pageType == typeof(RegistrationView))
                {
                    AppWindow.Resize(new Windows.Graphics.SizeInt32(500, 650));
                }
                else
                {
                    AppWindow.Resize(new Windows.Graphics.SizeInt32(1100, 750));
                }
            }
            else
            {
                AppWindow.SetPresenter(AppWindowPresenterKind.FullScreen);
                _lockTimer.Start();
            }

            ShowWindow();
            if (parameter != null)
            {
                RootFrame.Navigate(pageType, parameter);
            }
            else
            {
                RootFrame.Navigate(pageType);
            }
        }

        public void HideWindow()
        {
            _lockTimer.Stop();
            AppWindow.Hide();
        }

        public void ShowWindow()
        {
            AppWindow.Show();
        }
    }
}
