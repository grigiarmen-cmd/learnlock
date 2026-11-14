using System;
using Microsoft.Win32;

namespace LearnLock_App
{
    public static class StartupHelper
    {
        private const string AppName = "LearnLock";

        public static void RegisterAutoStart()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);
                if (key != null)
                {
                    string exePath = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName ?? "";
                    if (!string.IsNullOrEmpty(exePath))
                    {
                        key.SetValue(AppName, $"\"{exePath}\"");
                    }
                }
            }
            catch
            {
                // Ignore exceptions if registry access is denied
            }
        }

        public static void UnregisterAutoStart()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);
                key?.DeleteValue(AppName, false);
            }
            catch
            {
                // Ignore exceptions if registry access is denied
            }
        }

        public static bool IsAutoStartEnabled()
        {
            try
            {
                using var hklmKey = Registry.LocalMachine.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", false);
                if (hklmKey?.GetValue(AppName) != null) return true;

                using var key = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", false);
                return key?.GetValue(AppName) != null;
            }
            catch
            {
                return false;
            }
        }
    }
}
