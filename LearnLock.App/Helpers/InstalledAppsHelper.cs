using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Win32;

namespace LearnLock_App.Helpers
{
    public static class InstalledAppsHelper
    {
        public static List<string> GetInstalledApps()
        {
            var apps = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            string[] registryKeys = new[]
            {
                @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
            };

            // Check HKLM
            foreach (var keyPath in registryKeys)
            {
                using var key = Registry.LocalMachine.OpenSubKey(keyPath);
                ExtractAppsFromKey(key, apps);
            }

            // Check HKCU
            using var hkcuKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Uninstall");
            ExtractAppsFromKey(hkcuKey, apps);

            return apps.OrderBy(x => x).ToList();
        }

        private static void ExtractAppsFromKey(RegistryKey? rootKey, HashSet<string> apps)
        {
            if (rootKey == null) return;

            foreach (var subKeyName in rootKey.GetSubKeyNames())
            {
                try
                {
                    using var subKey = rootKey.OpenSubKey(subKeyName);
                    if (subKey == null) continue;

                    string displayName = subKey.GetValue("DisplayName")?.ToString() ?? "";
                    if (string.IsNullOrWhiteSpace(displayName)) continue;

                    // Filter out system updates and patches
                    if (displayName.Contains("KB") && displayName.Contains("Update")) continue;

                    string displayIcon = subKey.GetValue("DisplayIcon")?.ToString() ?? "";
                    string exeName = ExtractExeName(displayIcon);

                    if (!string.IsNullOrWhiteSpace(exeName))
                    {
                        apps.Add(exeName);
                    }
                    else
                    {
                        // Fallback to DisplayName if no exe found, AppBlocker might match it against ProcessName if lucky
                        apps.Add(displayName);
                    }
                }
                catch { }
            }
        }

        private static string ExtractExeName(string displayIcon)
        {
            if (string.IsNullOrWhiteSpace(displayIcon)) return string.Empty;

            try
            {
                // displayIcon might be something like "C:\Program Files\App\app.exe,0"
                string path = displayIcon.Split(',')[0].Trim('"', ' ');
                if (path.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                {
                    return Path.GetFileNameWithoutExtension(path);
                }
            }
            catch { }
            return string.Empty;
        }
    }
}
