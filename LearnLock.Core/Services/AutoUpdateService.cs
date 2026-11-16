using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
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
        private const string GitHubOwner = "obamalikesahh";
        private const string GitHubRepo = "learnlock";
        public const string CurrentVersion = "v2.4.0";

        private readonly HttpClient _httpClient;

        public AutoUpdateService()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("LearnLock", "2.4.0"));
        }

        public async Task<UpdateInfo?> CheckForUpdatesAsync(string currentVersion = CurrentVersion)
        {
            try
            {
                // Primary source: Central LearnLock Web API (safe from GitHub bans)
                string centralApiUrl = "https://learnlock-rho.vercel.app/api/version";
                var response = await _httpClient.GetAsync(centralApiUrl);
                if (response.IsSuccessStatusCode)
                {
                    string json = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("latestVersion", out var verProp))
                    {
                        string latestVer = verProp.GetString() ?? "";
                        if (!string.IsNullOrWhiteSpace(latestVer) && !latestVer.Equals(currentVersion, StringComparison.OrdinalIgnoreCase))
                        {
                            string downloadUrl = root.TryGetProperty("downloadUrl", out var dlProp) ? dlProp.GetString() ?? "" : "";
                            string notes = root.TryGetProperty("releaseNotes", out var nProp) ? nProp.GetString() ?? "" : "";

                            if (!string.IsNullOrEmpty(downloadUrl))
                            {
                                return new UpdateInfo
                                {
                                    version = latestVer,
                                    url = downloadUrl,
                                    releaseNotes = notes
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to check for updates from web API: {ex.Message}");
            }
            return null;
        }

        public async Task<string?> DownloadUpdateAsync(string downloadUrl)
        {
            try
            {
                var tempPath = Path.Combine(Path.GetTempPath(), "LearnLock-Update-Setup.exe");
                var bytes = await _httpClient.GetByteArrayAsync(downloadUrl);
                await File.WriteAllBytesAsync(tempPath, bytes);
                return tempPath;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Failed to download update: {ex.Message}");
                return null;
            }
        }

        public void InstallUpdateAndRestart(string installerPath)
        {
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = installerPath,
                    Arguments = "/VERYSILENT /SUPPRESSMSGBOXES /NORESTART /SP-",
                    UseShellExecute = true,
                    Verb = "runas"
                };

                Process.Start(startInfo);
                Environment.Exit(0);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Failed to launch updater: " + ex.Message);
            }
        }

        public static async Task CheckAndApplyUpdateInBackgroundAsync()
        {
            var service = new AutoUpdateService();
            var update = await service.CheckForUpdatesAsync(CurrentVersion);
            if (update != null && !string.IsNullOrEmpty(update.url))
            {
                string? file = await service.DownloadUpdateAsync(update.url);
                if (!string.IsNullOrEmpty(file) && File.Exists(file))
                {
                    service.InstallUpdateAndRestart(file);
                }
            }
        }
    }
}
