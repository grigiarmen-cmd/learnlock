using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using LearnLock.Core.Services;

namespace LearnLock.Timer
{
    public class SystemMonitorService
    {
        public static bool IsParentDashboardActive = false;
        public static bool IsChildActive = false;

        private readonly IAuthService _authService;
        private readonly ITimerService _timerService;
        private CancellationTokenSource? _cts;

        public SystemMonitorService(IAuthService authService, ITimerService timerService)
        {
            _authService = authService;
            _timerService = timerService;
        }

        public void StartMonitoring()
        {
            _cts = new CancellationTokenSource();
            Task.Run(() => MonitorLoop(_cts.Token));
        }

        public void StopMonitoring()
        {
            _cts?.Cancel();
        }

        private async Task MonitorLoop(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    // Block Task Manager when child mode is active or parent is not logged in
                    if (!IsParentDashboardActive)
                    {
                        var taskmgrs = Process.GetProcessesByName("Taskmgr");
                        foreach (var tm in taskmgrs)
                        {
                            try { tm.Kill(); } catch { }
                        }
                    }

                    var parent = await _authService.GetParentProfileAsync();
                    if (parent != null)
                    {
                        var blockedApps = new List<string>();
                        if (!string.IsNullOrWhiteSpace(parent.GlobalBlockedApps))
                        {
                            blockedApps = parent.GlobalBlockedApps
                                .Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)
                                .Select(s => s.Trim().ToLowerInvariant())
                                .ToList();
                        }

                        var blockedKeywords = new List<string>();
                        if (!string.IsNullOrWhiteSpace(parent.GlobalBlockedKeywords))
                        {
                            blockedKeywords = parent.GlobalBlockedKeywords
                                .Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)
                                .Select(s => s.Trim().ToLowerInvariant())
                                .ToList();
                        }

                        // Also block child's specific apps if the timer is running
                        if (_timerService.IsRunning && _timerService.ActiveChildId > 0)
                        {
                            var children = await _authService.GetChildrenAsync();
                            var activeChild = children.FirstOrDefault(c => c.Id == _timerService.ActiveChildId);
                            if (activeChild != null && !string.IsNullOrWhiteSpace(activeChild.BlockedApps))
                            {
                                var childBlocked = activeChild.BlockedApps
                                    .Split(new[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(s => s.Trim().ToLowerInvariant());
                                blockedApps.AddRange(childBlocked);
                            }
                        }

                        if (blockedApps.Count > 0 || blockedKeywords.Count > 0)
                        {
                            var activeProcesses = Process.GetProcesses();
                            foreach (var process in activeProcesses)
                            {
                                try
                                {
                                    bool shouldKill = false;
                                    string procName = process.ProcessName.ToLowerInvariant();
                                    string windowTitle = process.MainWindowTitle.ToLowerInvariant();

                                    // Check Apps
                                    foreach (var blockedApp in blockedApps)
                                    {
                                        string normalizedBlocked = blockedApp.EndsWith(".exe") ? blockedApp.Substring(0, blockedApp.Length - 4) : blockedApp;
                                        if (procName == normalizedBlocked)
                                        {
                                            shouldKill = true;
                                            break;
                                        }
                                    }

                                    // Check Keywords in Window Title
                                    if (!shouldKill && !string.IsNullOrWhiteSpace(windowTitle))
                                    {
                                        foreach (var keyword in blockedKeywords)
                                        {
                                            if (windowTitle.Contains(keyword))
                                            {
                                                shouldKill = true;
                                                break;
                                            }
                                        }
                                    }

                                    if (shouldKill)
                                    {
                                        process.Kill();
                                    }
                                }
                                catch
                                {
                                    // Ignore access denied exceptions for system processes
                                }
                            }
                        }
                    }
                }
                catch { }

                await Task.Delay(1000, token); // Check every second
            }
        }
    }
}
