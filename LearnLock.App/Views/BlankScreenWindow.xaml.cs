using System;
using System.Runtime.InteropServices;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using Windows.Graphics;

namespace LearnLock_App.Views
{
    public sealed partial class BlankScreenWindow : Window
    {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int x, int y, int cx, int cy, uint uFlags);

        private static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);
        private const uint SWP_NOMOVE = 0x0002;
        private const uint SWP_NOSIZE = 0x0001;
        private const uint SWP_SHOWWINDOW = 0x0040;

        public BlankScreenWindow(int x, int y, int width, int height)
        {
            this.InitializeComponent();
            
            Title = "LearnLock - Gesperrt";
            ExtendsContentIntoTitleBar = false;

            // Move and resize window to fit the monitor coordinates exactly
            AppWindow.MoveAndResize(new RectInt32(x, y, width, height));
            
            // Set presentation mode to Fullscreen
            AppWindow.SetPresenter(AppWindowPresenterKind.FullScreen);

            // Enforce topmost window position
            MakeTopMost();
        }

        public void MakeTopMost()
        {
            try
            {
                var hWnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
                SetWindowPos(hWnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
            }
            catch { }
        }
    }
}
