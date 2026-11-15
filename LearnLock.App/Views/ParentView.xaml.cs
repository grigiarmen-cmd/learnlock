using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using Microsoft.UI;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Models;
using LearnLock.Core.Services;
using LearnLock_App.Helpers;
using LearnLock_App.Services;
using LearnLock.Database;

namespace LearnLock_App.Views
{
    public sealed partial class ParentView : Page
    {
        private readonly IAuthService _authService;
        private List<ChildProfile> _children = new();
        private List<AppToggleItem> _appToggles = new();
        private string _selectedPlanForCheckout = "Basic";
        private int? _editingChildId = null;
        private string? _pendingUpdateUrl = null;
        private DispatcherTimer? _liveSyncTimer;
        private static readonly HttpClient _syncClient = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };

        public ParentView()
        {
            this.InitializeComponent();
            _authService = App.Services.GetRequiredService<IAuthService>();
            
            LearnLock.Timer.SystemMonitorService.IsParentDashboardActive = true;

            LoadParentSettings();
            LoadChildrenProfiles();
            
            CheckForUpdatesAsync();
            StartLivePlanSync();
        }

        private void StartLivePlanSync()
        {
            _liveSyncTimer = new DispatcherTimer();
            _liveSyncTimer.Interval = TimeSpan.FromSeconds(5); // poll every 5 seconds for instant admin triggers
            _liveSyncTimer.Tick += async (s, e) => await CheckLivePlanSyncAsync();
            _liveSyncTimer.Start();
        }

        private async Task CheckLivePlanSyncAsync()
        {
            try
            {
                var parent = await _authService.GetParentProfileAsync();
                if (parent == null || string.IsNullOrWhiteSpace(parent.Email)) return;

                string url = $"https://learnlock.vercel.app/api/admin-control?email={Uri.EscapeDataString(parent.Email.Trim())}";
                var res = await _syncClient.GetAsync(url);
                if (res.IsSuccessStatusCode)
                {
                    var json = await res.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("tier", out var tierProp))
                    {
                        string remoteTierStr = tierProp.GetString() ?? "Free";
                        SubscriptionTier remoteTier = remoteTierStr switch
                        {
                            "Ultra" or "Lifetime" => SubscriptionTier.Ultra,
                            "Pro" or "Yearly" => SubscriptionTier.Pro,
                            "Basic" => SubscriptionTier.Basic,
                            _ => SubscriptionTier.Free
                        };

                        if (parent.Tier != remoteTier)
                        {
                            var oldTier = parent.Tier;
                            parent.Tier = remoteTier;
                            if (remoteTier == SubscriptionTier.Ultra)
                            {
                                parent.SubscriptionExpiration = DateTime.Now.AddYears(100);
                            }
                            else if (remoteTier == SubscriptionTier.Free)
                            {
                                parent.SubscriptionExpiration = null;
                            }
                            await _authService.UpdateParentProfileAsync(parent);

                            // Refresh UI
                            LoadParentSettings();
                            _ = LoadChildrenProfilesAsync();

                            // Trigger corresponding animation / popup modal!
                            if (remoteTier == SubscriptionTier.Ultra || remoteTier == SubscriptionTier.Pro)
                            {
                                CelebrationPlanTitle.Text = remoteTier == SubscriptionTier.Ultra 
                                    ? "🎉 Lifetime Unlimited freigeschaltet!" 
                                    : "🎉 LearnLock Pro freigeschaltet!";
                                CelebrationDurationText.Text = remoteTier == SubscriptionTier.Ultra 
                                    ? "Lebenslanger Zugriff ohne Verlängerung" 
                                    : "1 Jahr voller Zugriff auf alle Premium-Features";
                                PlanDowngradeOverlay.Visibility = Visibility.Collapsed;
                                UnlockCelebrationOverlay.Visibility = Visibility.Visible;
                            }
                            else if (remoteTier == SubscriptionTier.Free)
                            {
                                UnlockCelebrationOverlay.Visibility = Visibility.Collapsed;
                                PlanDowngradeOverlay.Visibility = Visibility.Visible;
                            }
                        }
                    }
                }
            }
            catch { }
        }

        private async void CheckForUpdatesAsync()
        {
            var updateService = App.Services.GetService<AutoUpdateService>();
            if (updateService != null)
            {
                var updateInfo = await updateService.CheckForUpdatesAsync("1.0.1.0"); // Current Version
                if (updateInfo != null)
                {
                    _pendingUpdateUrl = updateInfo.url;
                    UpdateTitleText.Text = $"🎉 Version {updateInfo.version} ist verfügbar!";
                    UpdateDescText.Text = updateInfo.releaseNotes ?? "Klicke hier, um das Update zu installieren.";
                    UpdateBanner.Visibility = Visibility.Visible;
                }
            }
        }

        private async void InstallUpdateBtn_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(_pendingUpdateUrl)) return;

            InstallUpdateBtn.IsEnabled = false;
            InstallUpdateBtn.Content = "Wird heruntergeladen...";

            var updateService = App.Services.GetService<AutoUpdateService>();
            if (updateService != null)
            {
                var zipPath = await updateService.DownloadUpdateAsync(_pendingUpdateUrl);
                if (zipPath != null)
                {
                    InstallUpdateBtn.Content = "Installiere & Neustart...";
                    updateService.InstallUpdateAndRestart(zipPath);
                }
                else
                {
                    InstallUpdateBtn.Content = "Fehler beim Download";
                    InstallUpdateBtn.IsEnabled = true;
                }
            }
        }

        private async void Tab_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is string tabName)
            {
                // Reset sidebar buttons styles
                var unselectedForeground = new SolidColorBrush(ColorHelper.ToColor("#718096"));
                var unselectedBackground = new SolidColorBrush(Colors.Transparent);
                
                TabDashboard.Foreground = unselectedForeground;
                TabDashboard.Background = unselectedBackground;
                TabChildren.Foreground = unselectedForeground;
                TabChildren.Background = unselectedBackground;
                TabAppBlocker.Foreground = unselectedForeground;
                TabAppBlocker.Background = unselectedBackground;
                TabSettings.Foreground = unselectedForeground;
                TabSettings.Background = unselectedBackground;
                if (TabAccount != null)
                {
                    TabAccount.Foreground = unselectedForeground;
                    TabAccount.Background = unselectedBackground;
                }

                // Set selected button style (Consistent with Light Theme)
                btn.Foreground = new SolidColorBrush(ColorHelper.ToColor("#2D3748"));
                btn.Background = new SolidColorBrush(Colors.White);

                // Switch panels visibility
                PanelDashboard.Visibility = tabName == "Dashboard" ? Visibility.Visible : Visibility.Collapsed;
                PanelChildren.Visibility = tabName == "Children" ? Visibility.Visible : Visibility.Collapsed;
                PanelAppBlocker.Visibility = tabName == "AppBlocker" ? Visibility.Visible : Visibility.Collapsed;
                PanelSettings.Visibility = tabName == "Settings" ? Visibility.Visible : Visibility.Collapsed;
                if (PanelAccount != null) PanelAccount.Visibility = tabName == "Account" ? Visibility.Visible : Visibility.Collapsed;

                if (tabName == "AppBlocker")
                {
                    var parent = await _authService.GetParentProfileAsync();
                    if (parent == null || parent.Tier == SubscriptionTier.Free)
                    {
                        AppBlockerOverlay.Visibility = Visibility.Visible;
                    }
                    else
                    {
                        AppBlockerOverlay.Visibility = Visibility.Collapsed;
                    }
                }

                if (tabName == "Children")
                {
                    LoadChildrenProfiles();
                }
            }
        }

        private void LoadChildrenProfiles()
        {
            _ = LoadChildrenProfilesAsync();
        }

        private async Task LoadChildrenProfilesAsync()
        {
            try
            {
                _children = await _authService.GetChildrenAsync();
                ChildrenItemsControl.ItemsSource = null;
                ChildrenItemsControl.ItemsSource = _children;
                if (DashboardChildrenList != null) DashboardChildrenList.ItemsSource = _children;

                var parent = await _authService.GetParentProfileAsync();
                var tier = parent?.Tier ?? SubscriptionTier.Free;
                int childCount = _children.Count;
                int maxChildren = tier switch {
                    SubscriptionTier.Free => 1,
                    SubscriptionTier.Basic => 2,
                    SubscriptionTier.Pro => 5,
                    SubscriptionTier.Ultra => 10,
                    _ => 1
                };

                bool canAdd = childCount < maxChildren;
                if (AddProfileHeaderBtn != null) AddProfileHeaderBtn.Visibility = canAdd ? Visibility.Visible : Visibility.Collapsed;
                if (AddProfileDashboardBtn != null) AddProfileDashboardBtn.Visibility = canAdd ? Visibility.Visible : Visibility.Collapsed;
            }
            catch { }
        }

        private async void LoadParentSettings()
        {
            try
            {
                var parent = await _authService.GetParentProfileAsync();
                if (parent != null)
                {
                    var blockedList = (parent.GlobalBlockedApps ?? "")
                        .Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim().ToLowerInvariant())
                        .ToList();

                    var runningProcesses = Process.GetProcesses()
                        .Where(p => !string.IsNullOrWhiteSpace(p.MainWindowTitle))
                        .Select(p => p.ProcessName)
                        .ToList();

                    var installedApps = InstalledAppsHelper.GetInstalledApps();
                    var allApps = runningProcesses.Concat(installedApps)
                        .Distinct()
                        .OrderBy(name => name)
                        .ToList();

                    _appToggles.Clear();
                    var manualApps = new List<string>();

                    foreach (var blockedApp in blockedList)
                    {
                        string normalized = blockedApp.EndsWith(".exe") ? blockedApp.Substring(0, blockedApp.Length - 4) : blockedApp;
                        if (!allApps.Any(p => p.ToLowerInvariant() == normalized))
                        {
                            manualApps.Add(blockedApp);
                        }
                    }

                    foreach (var p in allApps)
                    {
                        bool isBlocked = blockedList.Contains(p.ToLowerInvariant());
                        
                        string glyph = "\xE7FC"; // Default Window
                        string color = "#6366F1";
                        string pLower = p.ToLowerInvariant();
                        if (pLower.Contains("discord")) { glyph = "\xE8F1"; color = "#5865F2"; } // Chat/Bubble
                        else if (pLower.Contains("chrome") || pLower.Contains("edge") || pLower.Contains("firefox") || pLower.Contains("opera") || pLower.Contains("brave")) { glyph = "\xE774"; color = "#10B981"; } // Globe
                        else if (pLower.Contains("roblox") || pLower.Contains("minecraft") || pLower.Contains("steam") || pLower.Contains("epic")) { glyph = "\xE7FC"; color = "#F59E0B"; } // Game (controller/cube)
                        else if (pLower.Contains("spotify") || pLower.Contains("itunes")) { glyph = "\xE8D6"; color = "#1DB954"; } // Music
                        else if (pLower.Contains("youtube")) { glyph = "\xE714"; color = "#FF0000"; } // Play
                        
                        _appToggles.Add(new AppToggleItem { AppName = p, IsBlocked = isBlocked, IconGlyph = glyph, IconColor = color });
                    }
                    
                    RunningAppsList.ItemsSource = null;
                    RunningAppsList.ItemsSource = _appToggles;

                    // Compute Dashboard Stats
                    int totalBlockedApps = manualApps.Count;
                    int totalKeywords = string.IsNullOrWhiteSpace(parent.GlobalBlockedKeywords) ? 0 : parent.GlobalBlockedKeywords.Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries).Length;
                    int totalAvailablePlaytime = 0;
                    int totalDailyLimit = 0;
                    if (_children.Count > 0)
                    {
                        foreach (var c in _children)
                        {
                            totalAvailablePlaytime += c.CurrentTimeBalanceSeconds;
                            totalDailyLimit += c.DailyLimitSeconds;
                            
                            if (!string.IsNullOrWhiteSpace(c.BlockedApps))
                            {
                                totalBlockedApps += c.BlockedApps.Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries).Length;
                            }
                        }
                        totalDailyLimit /= _children.Count; // Average
                    }
                    
                    if (StatTotalTimeText != null) StatTotalTimeText.Text = $"{(totalAvailablePlaytime / 3600)} Std. {((totalAvailablePlaytime % 3600) / 60)} Min.";
                    StatDailyAvgText.Text = $"{(totalDailyLimit / 3600)} Std. {((totalDailyLimit % 3600) / 60)} Min.";
                    StatActiveLimitsText.Text = $"{totalBlockedApps} Apps";
                    StatKeywordsText.Text = $"{totalKeywords} Stichwörter";

                    // Populate new dynamic elements
                    var allRules = new List<string>(manualApps);
                    if (!string.IsNullOrWhiteSpace(parent.GlobalBlockedKeywords))
                    {
                        allRules.AddRange(parent.GlobalBlockedKeywords.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries));
                    }
                    DashActiveRulesList.ItemsSource = allRules.Count > 0 ? allRules : new List<string> { "Keine Filter aktiv" };

                    int totalUsed = 0;
                    int totalAllowed = 0;
                    int maxRemaining = 0;
                    foreach(var c in _children)
                    {
                        int used = c.DailyLimitSeconds - c.CurrentTimeBalanceSeconds;
                        if (used < 0) used = 0;
                        totalUsed += used;
                        totalAllowed += c.DailyLimitSeconds;
                        int rem = c.CurrentTimeBalanceSeconds;
                        if(rem > maxRemaining) maxRemaining = rem;
                    }
                    
                    int progress = totalAllowed > 0 ? (int)((double)totalUsed / totalAllowed * 100) : 0;
                    DashProgressText.Text = $"{progress}%";
                    DashTimerText.Text = $"{(maxRemaining/3600):D2}:{((maxRemaining%3600)/60):D2}:{(maxRemaining%60):D2}";

                    if (DashboardChildrenList != null) DashboardChildrenList.ItemsSource = _children;

                    GlobalBlockedAppsInput.Text = string.Join(";", manualApps);
                    GlobalBlockedKeywordsInput.Text = parent.GlobalBlockedKeywords ?? string.Empty;
                    
                    AIToggle.IsOn = parent.IsAIAssistantEnabled;
                    AutoStartToggle.IsOn = StartupHelper.IsAutoStartEnabled();
                    
                    // Sync live license from Cloud Admin API
                    try
                    {
                        if (!string.IsNullOrWhiteSpace(parent.Email))
                        {
                            using var syncClient = new HttpClient { Timeout = TimeSpan.FromSeconds(3) };
                            var syncRes = await syncClient.GetAsync($"http://localhost:3000/api/admin-control?email={Uri.EscapeDataString(parent.Email)}");
                            if (syncRes.IsSuccessStatusCode)
                            {
                                var jsonDoc = JsonDocument.Parse(await syncRes.Content.ReadAsStringAsync());
                                if (jsonDoc.RootElement.TryGetProperty("tier", out var cloudTier))
                                {
                                    string tierStr = cloudTier.GetString() ?? "Free";
                                    var parsedTier = tierStr switch {
                                        "Ultra" or "Lifetime" => SubscriptionTier.Ultra,
                                        "Pro" => SubscriptionTier.Pro,
                                        "Basic" => SubscriptionTier.Basic,
                                        _ => SubscriptionTier.Free
                                    };

                                    if (parent.Tier != parsedTier)
                                    {
                                        parent.Tier = parsedTier;
                                        await _authService.UpdateParentProfileAsync(parent);
                                    }
                                }
                            }
                        }
                    }
                    catch { }

                    // Check if subscription has expired
                    if (parent.Tier != SubscriptionTier.Free && parent.SubscriptionExpiration.HasValue && parent.SubscriptionExpiration.Value < DateTime.Now)
                    {
                        parent.Tier = SubscriptionTier.Free;
                        parent.SubscriptionExpiration = null;
                        await _authService.UpdateParentProfileAsync(parent);
                    }

                    // Update Account Tab Info
                    if (AccountEmailText != null) AccountEmailText.Text = string.IsNullOrEmpty(parent.Email) ? "Keine E-Mail hinterlegt" : parent.Email;
                    if (AccountPlanText != null)
                    {
                        AccountPlanText.Text = parent.Tier switch {
                            SubscriptionTier.Ultra => "👑 Lifetime Unlimited (Vollzugriff)",
                            SubscriptionTier.Pro => "⭐ LearnLock Pro (Jahresabo)",
                            SubscriptionTier.Basic => "LearnLock Basic",
                            _ => "Free Tier (1 Kind / 1 Fach)"
                        };
                        AccountPlanText.Foreground = parent.Tier switch {
                            SubscriptionTier.Ultra => new SolidColorBrush(ColorHelper.ToColor("#F97316")),
                            SubscriptionTier.Pro => new SolidColorBrush(ColorHelper.ToColor("#3B82F6")),
                            _ => new SolidColorBrush(ColorHelper.ToColor("#64748B"))
                        };
                    }

                    // Check limits to disable add profile button
                    int childCount = _children.Count;
                    int maxChildren = parent.Tier switch {
                        SubscriptionTier.Free => 1,
                        SubscriptionTier.Basic => 2,
                        SubscriptionTier.Pro => 5,
                        SubscriptionTier.Ultra => 10,
                        _ => 1
                    };
                    bool canAdd = childCount < maxChildren;
                    if (AddProfileHeaderBtn != null) AddProfileHeaderBtn.Visibility = canAdd ? Visibility.Visible : Visibility.Collapsed;
                    if (AddProfileDashboardBtn != null) AddProfileDashboardBtn.Visibility = canAdd ? Visibility.Visible : Visibility.Collapsed;

                    // Set AppBlockerOverlay
                    if (AppBlockerOverlay != null) AppBlockerOverlay.Visibility = (parent.Tier == SubscriptionTier.Free) ? Visibility.Visible : Visibility.Collapsed;

                    // Set subscription check
                    PlanFree.IsChecked = parent.Tier == SubscriptionTier.Free;
                }
            }
            catch { }
        }

        private async void CreateChildButton_Click(object sender, RoutedEventArgs e)
        {
            var parent = await _authService.GetParentProfileAsync();
            var tier = parent?.Tier ?? SubscriptionTier.Free;
            int childCount = _children.Count;
            int maxChildren = tier switch {
                SubscriptionTier.Free => 1,
                SubscriptionTier.Basic => 2,
                SubscriptionTier.Pro => 5,
                SubscriptionTier.Ultra => 10,
                _ => 1
            };

            if (childCount >= maxChildren)
            {
                Tab_Click(new Button { Tag = "Settings" }, new RoutedEventArgs());
                return;
            }

            _editingChildId = null;
            if (CreateChildTitle != null) CreateChildTitle.Text = "Neues Profil einrichten";
            if (SubjectsPanel != null)
            {
                SubjectsPanel.Opacity = 1.0;
                SubjectsPanel.IsHitTestVisible = true;
            }
            ClearChildForm();
            CreateChildPanel.Visibility = Visibility.Visible;
            CreateChildErrorText.Visibility = Visibility.Collapsed;
        }

        private void CancelCreateChild_Click(object sender, RoutedEventArgs e)
        {
            CreateChildPanel.Visibility = Visibility.Collapsed;
        }

        private void ClearChildForm()
        {
            ChildNameInput.Text = string.Empty;
            ChildGradeInput.Text = string.Empty;
            DailyLimitInput.Text = string.Empty;
            BlockedAppsInput.Text = string.Empty;
            DifficultyComboBox.SelectedIndex = 0;

            SubjectMath.IsChecked = true;
            SubjectGerman.IsChecked = false;
            SubjectEnglish.IsChecked = false;
            SubjectBiology.IsChecked = false;
            SubjectChemistry.IsChecked = false;
            SubjectFrench.IsChecked = false;
            SubjectSpanish.IsChecked = false;
            SubjectReligion.IsChecked = false;
            SubjectSport.IsChecked = false;
        }

        private async void SaveNewChildProfile_Click(object sender, RoutedEventArgs e)
        {
            CreateChildErrorText.Visibility = Visibility.Collapsed;

            string name = ChildNameInput.Text.Trim();
            string gradeStr = ChildGradeInput.Text.Trim();
            string limitStr = DailyLimitInput.Text.Trim();
            string blocked = BlockedAppsInput.Text.Trim();
            
            if (string.IsNullOrWhiteSpace(name))
            {
                ShowCreateError("Bitte den Namen eingeben.");
                return;
            }

            if (!int.TryParse(gradeStr, out int grade))
            {
                ShowCreateError("Bitte eine gültige Klassenstufe eingeben.");
                return;
            }

            if (!int.TryParse(limitStr, out int limitMinutes))
            {
                ShowCreateError("Bitte ein tägliches Zeitlimit in Minuten eingeben.");
                return;
            }

            var difficulty = (DifficultyLevel)DifficultyComboBox.SelectedIndex;

            if (_editingChildId.HasValue)
            {
                using var context = new LearnLockDbContext();
                var child = context.ChildProfiles.Find(_editingChildId.Value);
                if (child != null)
                {
                    child.Name = name;
                    child.SchoolGrade = grade;
                    child.DailyLimitSeconds = limitMinutes * 60;
                    child.BlockedApps = blocked;
                    child.DifficultyLevel = difficulty;
                    
                    context.SaveChanges();
                    LoadChildrenProfiles();
                    
                    CreateChildPanel.Visibility = Visibility.Collapsed;
                    ClearChildForm();
                    return;
                }
            }

            // Retrieve parent subscription tier
            var parent = await _authService.GetParentProfileAsync();
            var tier = parent?.Tier ?? SubscriptionTier.Free;

            // Check max children limit
            int childCount = _children.Count;
            int maxChildren = tier switch {
                SubscriptionTier.Free => 1,
                SubscriptionTier.Basic => 2,
                SubscriptionTier.Pro => 5,
                SubscriptionTier.Ultra => 10,
                _ => 1
            };

            if (childCount >= maxChildren)
            {
                ShowCreateError($"Limit erreicht! Im {tier} Plan sind maximal {maxChildren} Profil(e) erlaubt. Bitte stufen Sie Ihr Abonnement hoch!");
                return;
            }

            // Form list of allowed subjects
            var selectedSubjects = new List<string>();
            if (SubjectMath.IsChecked == true) selectedSubjects.Add("Mathematik");
            if (SubjectGerman.IsChecked == true) selectedSubjects.Add("Deutsch");
            if (SubjectEnglish.IsChecked == true) selectedSubjects.Add("Englisch");
            if (SubjectBiology.IsChecked == true) selectedSubjects.Add("Biologie");
            if (SubjectChemistry.IsChecked == true) selectedSubjects.Add("Chemie");
            if (SubjectFrench.IsChecked == true) selectedSubjects.Add("Französisch");
            if (SubjectSpanish.IsChecked == true) selectedSubjects.Add("Spanisch");
            if (SubjectReligion.IsChecked == true) selectedSubjects.Add("Religion");
            if (SubjectSport.IsChecked == true) selectedSubjects.Add("Sport");

            // Plan limitations check
            if (tier == SubscriptionTier.Free)
            {
                if (selectedSubjects.Count > 1)
                {
                    ShowCreateError("Im Free Tier ist nur 1 Fach erlaubt. Bitte stufen Sie Ihr Abonnement hoch!");
                    return;
                }
                
                if (parent != null)
                {
                    if (string.IsNullOrEmpty(parent.LockedFreeSubject) && selectedSubjects.Count == 1)
                    {
                        parent.LockedFreeSubject = selectedSubjects.First();
                        await _authService.UpdateParentProfileAsync(parent);
                    }
                    else if (!string.IsNullOrEmpty(parent.LockedFreeSubject) && selectedSubjects.Any(s => s != parent.LockedFreeSubject))
                    {
                        ShowCreateError($"Dein Gratis-Fach ist auf '{parent.LockedFreeSubject}' festgelegt. Andere Fächer erfordern ein Upgrade!");
                        return;
                    }
                }
            }
            if (tier == SubscriptionTier.Basic && selectedSubjects.Count > 2)
            {
                ShowCreateError("Im Basic Plan sind maximal 2 Fächer erlaubt. Bitte stufen Sie Ihr Abonnement hoch!");
                return;
            }
            if (tier == SubscriptionTier.Pro && selectedSubjects.Count > 5)
            {
                ShowCreateError("Im Pro Plan sind maximal 5 Fächer erlaubt.");
                return;
            }

            string allowedSubjectsStr = string.Join(";", selectedSubjects);

            try
            {
                var child = await _authService.CreateChildAsync(name, difficulty, limitMinutes * 60, grade, blocked);
                child.AllowedSubjects = allowedSubjectsStr;
                await _authService.UpdateChildAsync(child);

                CreateChildPanel.Visibility = Visibility.Collapsed;
                LoadChildrenProfiles();
            }
            catch (Exception ex)
            {
                ShowCreateError($"Fehler beim Erstellen: {ex.Message}");
            }
        }

        private void ShowCreateError(string message)
        {
            CreateChildErrorText.Text = message;
            CreateChildErrorText.Visibility = Visibility.Visible;
        }

        private void EditChildProfile_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is ChildProfile child)
            {
                _editingChildId = child.Id;
                if (CreateChildTitle != null) CreateChildTitle.Text = "Profil bearbeiten";
                
                ChildNameInput.Text = child.Name;
                ChildGradeInput.Text = child.SchoolGrade.ToString();
                DailyLimitInput.Text = (child.DailyLimitSeconds / 60).ToString();
                BlockedAppsInput.Text = child.BlockedApps;
                DifficultyComboBox.SelectedIndex = (int)child.DifficultyLevel;
                
                if (SubjectsPanel != null)
                {
                    SubjectsPanel.Opacity = 0.5;
                    SubjectsPanel.IsHitTestVisible = false;
                }
                
                CreateChildPanel.Visibility = Visibility.Visible;
            }
        }

        private async void DeleteChildProfile_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is int childId)
            {
                try
                {
                    await _authService.DeleteChildAsync(childId);
                    LoadChildrenProfiles();
                }
                catch { }
            }
        }

        private void LockChildProfile_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is ChildProfile child)
            {
                // Instantly lock screen on child profile
                var lockWindow = new LockScreenWindow(child);
                lockWindow.Activate();
                App.MainWindowInstance?.HideWindow();
            }
        }



        private void LoadAegisPreset_Click(object sender, RoutedEventArgs e)
        {
            string aegisPresets = "porn, pron, porno, xxx, nsfw, hentai, pornhub, xvideos, xnxx, xhamster, redtube, youporn, chaturbate, onlyfans, erotik, sex, nude, rule34, cams, camgirl, milf, tits, boobs, hardcore, fetish, brazzers, stripchat, erotic, sexy, nudes, nackt, ficken, pussy, muschi, fotze, cock, dick, penis, schwanz, cum, squirt, blowjob, tiktok, roblox";
            if (string.IsNullOrWhiteSpace(GlobalBlockedKeywordsInput.Text))
            {
                GlobalBlockedKeywordsInput.Text = aegisPresets;
            }
            else
            {
                GlobalBlockedKeywordsInput.Text += ", " + aegisPresets;
            }
        }

        private async void SaveGlobalBlockedApps_Click(object sender, RoutedEventArgs e)
        {
            AppBlockerSuccessText.Visibility = Visibility.Collapsed;
            
            string manualApps = GlobalBlockedAppsInput.Text.Trim();
            var toggledApps = _appToggles.Where(a => a.IsBlocked).Select(a => a.AppName).ToList();
            
            var combined = new HashSet<string>(toggledApps);
            var manualList = manualApps.Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim());
            foreach (var m in manualList) combined.Add(m);

            string finalApps = string.Join(";", combined);
            string blockedKeywords = GlobalBlockedKeywordsInput.Text.Trim();

            try
            {
                var parent = await _authService.GetParentProfileAsync();
                if (parent != null)
                {
                    parent.GlobalBlockedApps = finalApps;
                    parent.GlobalBlockedKeywords = blockedKeywords;
                    await _authService.UpdateParentProfileAsync(parent);
                    
                    AppBlockerSuccessText.Visibility = Visibility.Visible;
                    await Task.Delay(2000);
                    AppBlockerSuccessText.Visibility = Visibility.Collapsed;
                }
            }
            catch { }
        }

        private void AppBlockerOverlay_PointerPressed(object sender, Microsoft.UI.Xaml.Input.PointerRoutedEventArgs e)
        {
            // Intercept pointer events so the user can't toggle apps in Free Tier
            e.Handled = true;
        }

        private async void AIToggle_Toggled(object sender, RoutedEventArgs e)
        {
            try
            {
                var parent = await _authService.GetParentProfileAsync();
                if (parent != null)
                {
                    parent.IsAIAssistantEnabled = AIToggle.IsOn;
                    await _authService.UpdateParentProfileAsync(parent);
                }
            }
            catch { }
        }

        private void AutoStartToggle_Toggled(object sender, RoutedEventArgs e)
        {
            if (AutoStartToggle.IsOn)
            {
                StartupHelper.RegisterAutoStart();
            }
            else
            {
                StartupHelper.UnregisterAutoStart();
            }
        }



        private void SubscriptionIntervalToggle_Toggled(object sender, RoutedEventArgs e)
        {
        }
        private async void Subject_Checked(object sender, RoutedEventArgs e)
        {
            if (sender is CheckBox cb && cb.IsChecked == true)
            {
                var parent = await _authService.GetParentProfileAsync();
                var tier = parent?.Tier ?? SubscriptionTier.Free;
                
                if (tier == SubscriptionTier.Free && parent != null && !string.IsNullOrEmpty(parent.LockedFreeSubject))
                {
                    if (cb.Content?.ToString() != parent.LockedFreeSubject)
                    {
                        cb.IsChecked = false;
                        // Optional: show a quick error popup or text
                        // But silent revert is often enough if they are on a limited plan
                        return;
                    }
                }
                
                int limit = tier switch {
                    SubscriptionTier.Free => 1,
                    SubscriptionTier.Basic => 2,
                    SubscriptionTier.Pro => 5,
                    _ => 999
                };

                int count = 0;
                if (SubjectMath?.IsChecked == true) count++;
                if (SubjectGerman?.IsChecked == true) count++;
                if (SubjectEnglish?.IsChecked == true) count++;
                if (SubjectBiology?.IsChecked == true) count++;
                if (SubjectChemistry?.IsChecked == true) count++;
                if (SubjectFrench?.IsChecked == true) count++;
                if (SubjectSpanish?.IsChecked == true) count++;
                if (SubjectReligion?.IsChecked == true) count++;
                if (SubjectSport?.IsChecked == true) count++;

                if (count > limit)
                {
                    cb.IsChecked = false;
                    // Optional: show a quick error popup or text
                    // But silent revert is often enough if they are on a limited plan
                }
            }
        }

        private void DirectStripeCheckout_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is string planName)
            {
                _selectedPlanForCheckout = planName;
                StripeCheckout_Click(this, null);
            }
        }

        private async void FreePlan_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                StripeWaitingPanel.Visibility = Visibility.Visible;
                StripeCheckoutButton.IsEnabled = false;

                var parent = await _authService.GetParentProfileAsync();
                if (parent != null)
                {
                    parent.Tier = SubscriptionTier.Free;
                    await _authService.UpdateParentProfileAsync(parent);
                }

                StripeWaitingPanel.Visibility = Visibility.Collapsed;
                StripeSuccessText.Text = "✅ Erfolgreich auf Free-Plan gewechselt!";
                StripeSuccessText.Visibility = Visibility.Visible;
                PlanFree.IsChecked = true;
            }
            catch (Exception)
            {
                StripeWaitingPanel.Visibility = Visibility.Collapsed;
            }
        }

        private async void StripeCheckout_Click(object sender, RoutedEventArgs e)
        {
            StripeCheckoutButton.IsEnabled = false;
            StripeWaitingPanel.Visibility = Visibility.Visible;
            StripeSuccessText.Visibility = Visibility.Collapsed;

            string selectedPlan = _selectedPlanForCheckout;

            bool isYearly = SubscriptionIntervalToggle.IsOn;

            try
            {
                var parent = await _authService.GetParentProfileAsync();
                string email = parent?.Email ?? "eltern@learnlock.local";
                
                var stripeService = new StripePaymentService();
                var session = await stripeService.CreateCheckoutSessionAsync(selectedPlan, isYearly, email);
                
                // Open browser
                Process.Start(new ProcessStartInfo { FileName = session.Url, UseShellExecute = true });

                // Poll Stripe
                bool paid = false;
                for(int i = 0; i < 60; i++) // 60 loops * 3s = 3 minutes timeout
                {
                    await Task.Delay(3000);
                    if (await stripeService.IsSessionPaidAsync(session.Id))
                    {
                        paid = true;
                        break;
                    }
                }

                if (paid)
                {
                    StripeSuccessText.Visibility = Visibility.Visible;
                    StripeWaitingPanel.Visibility = Visibility.Collapsed;
                    if (parent != null)
                    {
                        bool isUltra = selectedPlan.Equals("Ultra", StringComparison.OrdinalIgnoreCase);
                        parent.Tier = isUltra ? SubscriptionTier.Ultra : SubscriptionTier.Pro;
                        parent.SubscriptionExpiration = isUltra ? DateTime.Now.AddYears(100) : DateTime.Now.AddYears(1);
                        await _authService.UpdateParentProfileAsync(parent);

                        // Refresh parent settings & children UI immediately
                        LoadParentSettings();
                        _ = LoadChildrenProfilesAsync();

                        // Show epic celebration modal with unlocked perks
                        CelebrationPlanTitle.Text = isUltra 
                            ? "🎉 Lifetime Unlimited freigeschaltet!" 
                            : "🎉 LearnLock Pro freigeschaltet!";
                        CelebrationDurationText.Text = isUltra 
                            ? "Lebenslanger Zugriff ohne Verlängerung" 
                            : "1 Jahr voller Zugriff auf alle Premium-Features";
                        UnlockCelebrationOverlay.Visibility = Visibility.Visible;
                    }
                }
                else
                {
                    StripeWaitingPanel.Visibility = Visibility.Collapsed;
                    StripeCheckoutButton.IsEnabled = true;
                }
            }
            catch (Exception ex)
            {
                StripeWaitingPanel.Visibility = Visibility.Collapsed;
                StripeCheckoutButton.IsEnabled = true;
                System.Diagnostics.Debug.WriteLine($"[Stripe Checkout Error] {ex}");
            }
        }

        private void CloseCelebration_Click(object sender, RoutedEventArgs e)
        {
            UnlockCelebrationOverlay.Visibility = Visibility.Collapsed;
            // Switch tab to Dashboard
            Tab_Click(new Button { Tag = "Dashboard" }, new RoutedEventArgs());
        }

        private void CloseDowngradeModal_Click(object sender, RoutedEventArgs e)
        {
            PlanDowngradeOverlay.Visibility = Visibility.Collapsed;
        }

        private void UpgradeAccountPlan_Click(object sender, RoutedEventArgs e)
        {
            Tab_Click(new Button { Tag = "Settings" }, new RoutedEventArgs());
        }

        private string? _deleteAccountOtpCode;

        private async void StartDeleteAccount_Click(object sender, RoutedEventArgs e)
        {
            DeleteAccountErrorText.Visibility = Visibility.Collapsed;
            var parent = await _authService.GetParentProfileAsync();
            string email = parent?.Email?.Trim() ?? "";

            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
            {
                DeleteAccountErrorText.Text = "Keine gültige E-Mail-Adresse für die Bestätigung hinterlegt.";
                DeleteAccountErrorText.Visibility = Visibility.Visible;
                return;
            }

            StartDeleteAccountBtn.IsEnabled = false;
            StartDeleteAccountBtn.Content = "Bestätigungscode wird gesendet...";

            _deleteAccountOtpCode = Random.Shared.Next(100000, 1000000).ToString();
            bool sent = await _authService.SendOtpCodeAsync(email, _deleteAccountOtpCode);

            if (sent)
            {
                StartDeleteAccountBtn.Visibility = Visibility.Collapsed;
                DeleteAccountConfirmPanel.Visibility = Visibility.Visible;
            }
            else
            {
                DeleteAccountErrorText.Text = "Fehler beim Senden des Bestätigungscodes.";
                DeleteAccountErrorText.Visibility = Visibility.Visible;
                StartDeleteAccountBtn.IsEnabled = true;
                StartDeleteAccountBtn.Content = "🗑️ Konto löschen & Setup neu starten";
            }
        }

        private async void ConfirmDeleteAccount_Click(object sender, RoutedEventArgs e)
        {
            DeleteAccountErrorText.Visibility = Visibility.Collapsed;
            string enteredCode = DeleteAccountCodeInput.Text.Trim();

            if (string.IsNullOrWhiteSpace(enteredCode) || enteredCode != _deleteAccountOtpCode)
            {
                DeleteAccountErrorText.Text = "Ungültiger Bestätigungscode.";
                DeleteAccountErrorText.Visibility = Visibility.Visible;
                return;
            }

            bool deleted = await _authService.DeleteParentAccountAsync();
            if (deleted)
            {
                LearnLock.Timer.SystemMonitorService.IsParentDashboardActive = false;
                Frame.Navigate(typeof(RegistrationView));
            }
            else
            {
                DeleteAccountErrorText.Text = "Fehler beim Löschen des Kontos.";
                DeleteAccountErrorText.Visibility = Visibility.Visible;
            }
        }

        private void CancelDeleteAccount_Click(object sender, RoutedEventArgs e)
        {
            _deleteAccountOtpCode = null;
            DeleteAccountCodeInput.Text = string.Empty;
            DeleteAccountConfirmPanel.Visibility = Visibility.Collapsed;
            StartDeleteAccountBtn.Visibility = Visibility.Visible;
            StartDeleteAccountBtn.IsEnabled = true;
            StartDeleteAccountBtn.Content = "🗑️ Konto löschen & Setup neu starten";
        }

        private void CancelStripeSubscription_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Open Stripe customer portal or email support for instant cancellation
                Process.Start(new ProcessStartInfo { 
                    FileName = "https://billing.stripe.com/p/login/test", 
                    UseShellExecute = true 
                });
            }
            catch { }
        }

        private void Logout_Click(object sender, RoutedEventArgs e)
        {
            LearnLock.Timer.SystemMonitorService.IsParentDashboardActive = false;
            Frame.Navigate(typeof(LoginView));
        }
    }

    public static class ColorHelper
    {
        public static Windows.UI.Color ToColor(string hex)
        {
            hex = hex.Replace("#", string.Empty);
            byte r = byte.Parse(hex.Substring(0, 2), System.Globalization.NumberStyles.HexNumber);
            byte g = byte.Parse(hex.Substring(2, 2), System.Globalization.NumberStyles.HexNumber);
            byte b = byte.Parse(hex.Substring(4, 2), System.Globalization.NumberStyles.HexNumber);
            return Windows.UI.Color.FromArgb(255, r, g, b);
        }
    }

    public class AppToggleItem
    {
        public string AppName { get; set; } = string.Empty;
        public bool IsBlocked { get; set; }
        public string IconGlyph { get; set; } = "\xE7FC";
        public string IconColor { get; set; } = "#6366F1";
    }
}
