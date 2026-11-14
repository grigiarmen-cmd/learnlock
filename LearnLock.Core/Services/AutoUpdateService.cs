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
                string apiUrl = $"https://api.github.com/repos/{GitHubOwner}/{GitHubRepo}/releases/latest";
                var response = await _httpClient.GetAsync(apiUrl);
                if (!response.IsSuccessStatusCode) return null;

                string json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (!root.TryGetProperty("tag_name", out var tagProp)) return null;
                string latestTag = tagProp.GetString() ?? "";

                if (string.IsNullOrWhiteSpace(latestTag) || latestTag.Equals(currentVersion, StringComparison.OrdinalIgnoreCase))
                {
                    return null;
                }

                if (!root.TryGetProperty("assets", out var assetsProp) || assetsProp.ValueKind != JsonValueKind.Array)
                {
                    return null;
                }

                string downloadUrl = "";
                foreach (var asset in assetsProp.EnumerateArray())
                {
                    if (asset.TryGetProperty("name", out var nameProp) && 
                        asset.TryGetProperty("browser_download_url", out var urlProp))
                    {
                        string name = nameProp.GetString() ?? "";
                        if (name.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                        {
                            downloadUrl = urlProp.GetString() ?? "";
                            break;
                        }
                    }
                }

                if (!string.IsNullOrEmpty(downloadUrl))
                {
                    return new UpdateInfo
                    {
                        version = latestTag,
                        url = downloadUrl,
                        releaseNotes = root.TryGetProperty("body", out var b) ? b.GetString() ?? "" : ""
                    };
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
