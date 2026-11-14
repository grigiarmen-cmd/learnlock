using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace LearnLock.Core.Services
{
    public class UpdateInfo
    {
        public string version { get; set; } = "";
        public string url { get; set; } = "";
        public string releaseNotes { get; set; } = "";
    }

    public class AutoUpdateService
    {
        private readonly HttpClient _httpClient;
        private readonly string _updateUrl = "http://localhost:3000/download/version.json";

        public AutoUpdateService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<UpdateInfo?> CheckForUpdatesAsync(string currentVersion)
        {
            try
            {
                var json = await _httpClient.GetStringAsync(_updateUrl);
                var updateInfo = JsonSerializer.Deserialize<UpdateInfo>(json);

                if (updateInfo != null && IsNewerVersion(currentVersion, updateInfo.version))
                {
                    return updateInfo;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to check for updates: {ex.Message}");
            }
            return null;
        }

        public async Task<string?> DownloadUpdateAsync(string downloadUrl)
        {
            try
            {
                var tempPath = Path.Combine(Path.GetTempPath(), "LearnLock-Portable.zip");
                var response = await _httpClient.GetAsync(downloadUrl);
                response.EnsureSuccessStatusCode();

                using var fs = new FileStream(tempPath, FileMode.Create, FileAccess.Write, FileShare.None);
                await response.Content.CopyToAsync(fs);
                
                return tempPath;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to download update: {ex.Message}");
                return null;
            }
        }

        public void InstallUpdateAndRestart(string zipPath)
        {
            string exePath = Process.GetCurrentProcess().MainModule?.FileName ?? "";
            string appDir = Path.GetDirectoryName(exePath) ?? "";
            
            // Expected updater path
            string updaterPath = Path.Combine(appDir, "LearnLock.Updater.exe");
            
            if (!File.Exists(updaterPath))
            {
                Debug.WriteLine("Updater not found at " + updaterPath);
                return;
            }

            int pid = Process.GetCurrentProcess().Id;
            string arguments = $"{pid} \"{zipPath}\" \"{appDir}\" \"{exePath}\"";

            Process.Start(new ProcessStartInfo
            {
                FileName = updaterPath,
                Arguments = arguments,
                UseShellExecute = true, // To pop out of the current process group
                CreateNoWindow = false
            });

            // The main app should exit right after this
            Environment.Exit(0);
        }

        private bool IsNewerVersion(string current, string latest)
        {
            if (Version.TryParse(current, out var vCurrent) && Version.TryParse(latest, out var vLatest))
            {
                return vLatest > vCurrent;
            }
            return false;
        }
    }
}
