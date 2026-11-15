using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.UI;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Models;
using LearnLock.Core.Services;

namespace LearnLock_App.Views
{
    public sealed partial class LockScreenWindow : Window
    {
        private readonly IMathService _mathService;
        private readonly IAuthService _authService;
        private readonly ITimerService _timerService;
        private readonly ChildProfile _child;
        private MathTask _currentTask = null!;
        private List<BlankScreenWindow>? _secondaryWindows;
        private bool _isUnlocked = false;
        private int _tasksSolved = 0;
        private System.Collections.ObjectModel.ObservableCollection<string> _chatMessages = new();

        // Win32 APIs
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int x, int y, int cx, int cy, uint uFlags);

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        // --- KEYBOARD HOOK ---
        private const int WH_KEYBOARD_LL = 13;
        private const int WM_KEYDOWN = 0x0100;
        private const int WM_SYSKEYDOWN = 0x0104;
        private static LowLevelKeyboardProc _proc = HookCallback;
        private static IntPtr _hookID = IntPtr.Zero;

        private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool UnhookWindowsHookEx(IntPtr hhk);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr GetModuleHandle(string lpModuleName);

        private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0 && (wParam == (IntPtr)WM_KEYDOWN || wParam == (IntPtr)WM_SYSKEYDOWN))
            {
                int vkCode = Marshal.ReadInt32(lParam);
                
                // Block Windows Key (LWIN=91, RWIN=92), Alt+Tab (Alt=164/165, Tab=9), Ctrl+Esc
                bool isLWin = vkCode == 91;
                bool isRWin = vkCode == 92;
                bool isTab = vkCode == 9;
                bool isAlt = (GetKeyState(164) & 0x8000) != 0 || (GetKeyState(165) & 0x8000) != 0;
                bool isCtrl = (GetKeyState(162) & 0x8000) != 0 || (GetKeyState(163) & 0x8000) != 0;

                if (isLWin || isRWin || (isAlt && isTab) || (isCtrl && vkCode == 27))
                {
                    return (IntPtr)1; // Block key
                }
            }
            return CallNextHookEx(_hookID, nCode, wParam, lParam);
        }

        [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true, CallingConvention = CallingConvention.Winapi)]
        public static extern short GetKeyState(int keyCode);
        // ---------------------

        [StructLayout(LayoutKind.Sequential)]
        public struct RECT
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
        public struct MONITORINFO
        {
            public int Size;
            public RECT Monitor;
            public RECT Work;
            public int Flags;
        }

        private delegate bool MonitorEnumDelegate(IntPtr hMonitor, IntPtr hdcMonitor, ref RECT lprcMonitor, IntPtr dwData);

        [DllImport("user32.dll")]
        private static extern bool EnumDisplayMonitors(IntPtr hdc, IntPtr lprcClip, MonitorEnumDelegate lpfnEnum, IntPtr dwData);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern bool GetMonitorInfo(IntPtr hMonitor, ref MONITORINFO lpmi);

        private static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);
        private const uint SWP_NOMOVE = 0x0002;
        private const uint SWP_NOSIZE = 0x0001;
        private const uint SWP_SHOWWINDOW = 0x0040;
        private const int MONITORINFOF_PRIMARY = 0x00000001;

        public LockScreenWindow(ChildProfile child)
        {
            this.InitializeComponent();
            try
            {
                string iconPath = System.IO.Path.Combine(AppContext.BaseDirectory, "Assets", "AppIcon.ico");
                if (System.IO.File.Exists(iconPath))
                {
                    AppWindow.SetIcon(iconPath);
                }
            }
            catch { }
            _child = child;

            _mathService = App.Services.GetRequiredService<IMathService>();
            _authService = App.Services.GetRequiredService<IAuthService>();
            _timerService = App.Services.GetRequiredService<ITimerService>();

            // Configure Window style
            Title = "LearnLock - Sperrbildschirm";
            ExtendsContentIntoTitleBar = false;

            // Set Fullscreen mode
            AppWindow.SetPresenter(AppWindowPresenterKind.FullScreen);

            // Hook closing to prevent bypass
            AppWindow.Closing += AppWindow_Closing;

            // Set HWND_TOPMOST via Win32 Interop
            MakeTopMost();

            // Populate child profile details
            ChildNameText.Text = _child.Name;

            // Setup Logon Screen Clock
            ClockText.Text = DateTime.Now.ToString("HH:mm");
            DateText.Text = DateTime.Now.ToString("dddd, d. MMMM", new System.Globalization.CultureInfo("de-DE"));
            
            var clockTimer = new DispatcherTimer();
            clockTimer.Interval = TimeSpan.FromSeconds(1);
            clockTimer.Tick += (s, e) =>
            {
                ClockText.Text = DateTime.Now.ToString("HH:mm");
                DateText.Text = DateTime.Now.ToString("dddd, d. MMMM", new System.Globalization.CultureInfo("de-DE"));
            };
            clockTimer.Start();

            ChatMessagesList.ItemsSource = _chatMessages;

            // Enumerate monitors and cover secondary monitors with black BlankScreenWindows
            SpawnSecondaryMonitorLocks();

            // Check Subscription for Locky Chat
            CheckSubscriptionForAI();

            // Setup high frequency topmost & focus lock timer
            var lockTimer = new DispatcherTimer();
            lockTimer.Interval = TimeSpan.FromMilliseconds(50);
            lockTimer.Tick += (s, e) => EnforceLockscreenLock();
            lockTimer.Start();

            // Register cleanup on window closing
            this.Closed += (s, e) => {
                CloseSecondaryWindows();
                if (_hookID != IntPtr.Zero)
                {
                    UnhookWindowsHookEx(_hookID);
                    _hookID = IntPtr.Zero;
                }
            };

            // Register LowLevelKeyboard hook
            using (var curProcess = System.Diagnostics.Process.GetCurrentProcess())
            using (var curModule = curProcess.MainModule)
            {
                if (curModule != null)
                {
                    _hookID = SetWindowsHookEx(WH_KEYBOARD_LL, _proc, GetModuleHandle(curModule.ModuleName), 0);
                }
            }

            // Load first task
            GenerateChallenge();
        }

        private async void CheckSubscriptionForAI()
        {
            try
            {
                var parent = await _authService.GetParentProfileAsync();
                if (parent != null && parent.IsAIAssistantEnabled && (parent.Tier == SubscriptionTier.Pro || parent.Tier == SubscriptionTier.Ultra))
                {
                    LockyChatBorder.Visibility = Visibility.Visible;
                }
            }
            catch { }
        }

        private void AppWindow_Closing(AppWindow sender, AppWindowClosingEventArgs args)
        {
            if (!_isUnlocked)
            {
                args.Cancel = true;
            }
        }

        private void SpawnSecondaryMonitorLocks()
        {
            try
            {
                _secondaryWindows = new List<BlankScreenWindow>();
                EnumDisplayMonitors(IntPtr.Zero, IntPtr.Zero, delegate (IntPtr hMonitor, IntPtr hdcMonitor, ref RECT lprcMonitor, IntPtr dwData)
                {
                    var mi = new MONITORINFO();
                    mi.Size = Marshal.SizeOf(typeof(MONITORINFO));
                    if (GetMonitorInfo(hMonitor, ref mi))
                    {
                        // If it's not the primary monitor, spawn a blackout screen
                        if ((mi.Flags & MONITORINFOF_PRIMARY) == 0)
                        {
                            int width = mi.Monitor.Right - mi.Monitor.Left;
                            int height = mi.Monitor.Bottom - mi.Monitor.Top;
                            var blankWin = new BlankScreenWindow(mi.Monitor.Left, mi.Monitor.Top, width, height);
                            blankWin.Activate();
                            _secondaryWindows.Add(blankWin);
                        }
                    }
                    return true;
                }, IntPtr.Zero);
            }
            catch { }
        }

        private void EnforceLockscreenLock()
        {
            try
            {
                var mainHwnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
                IntPtr activeHwnd = GetForegroundWindow();

                bool isOurs = activeHwnd == mainHwnd;
                if (!isOurs && _secondaryWindows != null)
                {
                    foreach (var w in _secondaryWindows)
                    {
                        var secHwnd = WinRT.Interop.WindowNative.GetWindowHandle(w);
                        if (activeHwnd == secHwnd)
                        {
                            isOurs = true;
                            break;
                        }
                    }
                }

                if (!isOurs)
                {
                    // ONLY push foreground and grab focus when another process/window steals focus
                    SetWindowPos(mainHwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
                    SetForegroundWindow(mainHwnd);
                    if (AnswerInput.Visibility == Visibility.Visible)
                    {
                        // Don't force focus away from other text boxes if they are trying to use them
                        // AnswerInput.Focus(FocusState.Programmatic);
                    }

                    if (_secondaryWindows != null)
                    {
                        foreach (var w in _secondaryWindows)
                        {
                            w.MakeTopMost();
                        }
                    }
                }
            }
            catch { }
        }

        private void CloseSecondaryWindows()
        {
            if (_secondaryWindows != null)
            {
                foreach (var w in _secondaryWindows)
                {
                    try { w.Close(); } catch { }
                }
                _secondaryWindows.Clear();
            }
        }

        private void MakeTopMost()
        {
            try
            {
                var hWnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
                SetWindowPos(hWnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
            }
            catch { }
        }

        private void GenerateChallenge()
        {
            int grade = _child.SchoolGrade > 0 ? _child.SchoolGrade : 5;
            _currentTask = _mathService.GenerateTaskForSubject(_child.DifficultyLevel, _child.AllowedSubjects ?? "Mathematik", grade);
            
            SubjectLabel.Text = $"FACH: {_currentTask.Subject.ToUpper()} (KLASSE {grade})";

            // Support general knowledge Multiple Choice layout
            if (!string.IsNullOrEmpty(_currentTask.CustomQuestion))
            {
                EquationText.Text = _currentTask.CustomQuestion;
                EquationText.FontSize = _currentTask.CustomQuestion.Length > 60 ? 15 : 18;
                AnswerInput.Visibility = Visibility.Collapsed;
                OptionsPanel.Children.Clear();
                OptionsPanel.Visibility = Visibility.Visible;

                var choices = _currentTask.Options.Split(';', StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < choices.Length; i++)
                {
                    var rb = new RadioButton
                    {
                        Content = choices[i],
                        Tag = i,
                        Foreground = new SolidColorBrush(Colors.White),
                        FontSize = 14,
                        Margin = new Thickness(0, 2, 0, 2)
                    };
                    OptionsPanel.Children.Add(rb);
                }
            }
            else
            {
                OptionsPanel.Visibility = Visibility.Collapsed;
                AnswerInput.Visibility = Visibility.Visible;

                if (_currentTask.Operator == MathOperator.Exponentiation)
                {
                    EquationText.Text = $"{_currentTask.Operand1}ˣ = {_currentTask.Operand2}   (Finde x)";
                    EquationText.FontSize = 26;
                }
                else
                {
                    EquationText.Text = $"{_currentTask.Operand1} {GetOperatorChar(_currentTask.Operator)} {_currentTask.Operand2} = ?";
                    EquationText.FontSize = 32;
                }

                AnswerInput.Text = string.Empty;
                AnswerInput.Focus(FocusState.Programmatic);
            }

            FeedbackText.Visibility = Visibility.Collapsed;
            VerifyButton.IsEnabled = true;
            AnswerInput.IsEnabled = true;
        }

        private async void VerifyAnswer_Click(object sender, RoutedEventArgs e)
        {
            int userAnswer = -1;

            if (!string.IsNullOrEmpty(_currentTask.CustomQuestion))
            {
                // Multi choice verification
                bool selected = false;
                foreach (var child in OptionsPanel.Children)
                {
                    if (child is RadioButton rb && rb.IsChecked == true)
                    {
                        userAnswer = (int)rb.Tag;
                        selected = true;
                        break;
                    }
                }
                if (!selected)
                {
                    ShowFeedback(false, "Bitte wählen Sie eine Antwort aus.");
                    return;
                }
            }
            else
            {
                // Text input verification
                if (!int.TryParse(AnswerInput.Text, out userAnswer))
                {
                    ShowFeedback(false, "Bitte eine gültige Zahl eingeben.");
                    return;
                }
            }

            bool isCorrect = _mathService.VerifyAnswer(_currentTask, userAnswer);
            VerifyButton.IsEnabled = false;
            AnswerInput.IsEnabled = false;

            if (isCorrect)
            {
                _tasksSolved++;
                ProgressLabel.Text = $"Fortschritt: {_tasksSolved} / 20 Aufgaben gelöst";

                int reward = _mathService.GetRewardTimeSeconds(_child.DifficultyLevel, isCorrect);

                try
                {
                    await _mathService.SaveTaskHistoryAsync(_child.Id, _currentTask, userAnswer, true, _tasksSolved >= 20 ? reward : 0);
                }
                catch { }

                if (_tasksSolved >= 20)
                {
                    _isUnlocked = true;
                    ShowFeedback(true, $"Klasse! 20/20 Aufgaben gelöst! +15 Minuten Spielzeit freigeschaltet.");

                    try
                    {
                        // Set child's current time balance to the reward (15 minutes = 900 seconds)
                        _child.CurrentTimeBalanceSeconds = reward;
                        await _authService.UpdateChildAsync(_child);

                        _timerService.Start(_child.Id, reward);
                    }
                    catch { }

                    await Task.Delay(2000);
                    App.MainWindowInstance?.ShowAndNavigate(typeof(ChildView), _child);
                    this.Close();
                }
                else
                {
                    ShowFeedback(true, $"Korrekt! Nächste Aufgabe folgt...");
                    await Task.Delay(1000);
                    GenerateChallenge();
                }
            }
            else
            {
                ShowFeedback(false, "Leider falsch! Versuche es noch einmal.");
                await Task.Delay(1500);
                GenerateChallenge();
            }
        }

        private async void ParentUnlock_Click(object sender, RoutedEventArgs e)
        {
            ParentErrorText.Visibility = Visibility.Collapsed;
            string password = ParentPasswordInput.Password;
            if (string.IsNullOrEmpty(password))
            {
                return;
            }

            bool authenticated = await _authService.VerifyParentPasswordAsync(password);
            if (authenticated)
            {
                _isUnlocked = true;

                // Stop child timer so parent can freely configure settings
                _timerService.Stop();

                // Open Parent Dashboard directly
                App.MainWindowInstance?.ShowAndNavigate(typeof(ParentView));
                this.Close();
            }
            else
            {
                ParentPasswordInput.Password = string.Empty;
                ParentErrorText.Visibility = Visibility.Visible;
            }
        }

        private void AnswerInput_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == Windows.System.VirtualKey.Enter && VerifyButton.IsEnabled)
            {
                VerifyAnswer_Click(sender, new RoutedEventArgs());
            }
        }

        private void ParentPasswordInput_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == Windows.System.VirtualKey.Enter)
            {
                ParentUnlock_Click(sender, new RoutedEventArgs());
            }
        }

        private void ShowFeedback(bool isSuccess, string message)
        {
            FeedbackText.Text = message;
            FeedbackText.Foreground = new SolidColorBrush(isSuccess ? Colors.Green : Colors.Red);
            FeedbackText.Visibility = Visibility.Visible;
        }

        private string GetOperatorChar(MathOperator op)
        {
            return op switch
            {
                MathOperator.Addition => "+",
                MathOperator.Subtraction => "-",
                MathOperator.Multiplication => "*",
                MathOperator.Division => "/",
                _ => "?"
            };
        }

        private void ChatInputBox_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == Windows.System.VirtualKey.Enter)
            {
                SendChat_Click(sender, new RoutedEventArgs());
            }
        }

        private async void SendChat_Click(object sender, RoutedEventArgs e)
        {
            string message = ChatInputBox.Text.Trim();
            if (string.IsNullOrEmpty(message)) return;

            ChatInputBox.Text = string.Empty;
            _chatMessages.Add($"Du: {message}");

            // Simulate KI delay
            await Task.Delay(600);

            // KI Response generation
            string response = "Locky: Ich bin hier um zu helfen! ";
            if (_currentTask != null)
            {
                if (!string.IsNullOrEmpty(_currentTask.CustomQuestion))
                {
                    response += "Das ist eine Textaufgabe. Lies dir die Frage genau durch und schließe die offensichtlich falschen Antworten aus.";
                }
                else
                {
                    switch (_currentTask.Operator)
                    {
                        case MathOperator.Addition:
                            response += "Tipp: Denk daran, die Einer und dann die Zehner zusammenzurechnen.";
                            break;
                        case MathOperator.Subtraction:
                            response += "Tipp: Was fehlt von der zweiten Zahl bis zur ersten?";
                            break;
                        case MathOperator.Multiplication:
                            response += "Tipp: Du kannst dir die Aufgabe auch als mehrfache Plus-Aufgabe vorstellen.";
                            break;
                        case MathOperator.Division:
                            response += "Tipp: Das ist das Gegenteil von Mal-Rechnen. Wie oft passt die zweite Zahl in die erste?";
                            break;
                        default:
                            response += "Versuche dein Bestes! Du schaffst das.";
                            break;
                    }
                }
            }

            _chatMessages.Add(response);
        }
    }
}
