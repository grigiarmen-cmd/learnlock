using System;
using System.Threading;
using LearnLock.Core.Services;

namespace LearnLock.Timer
{
    public class TimerService : ITimerService
    {
        private System.Threading.Timer? _timer;
        private readonly object _lock = new object();

        public int CurrentTimeSeconds { get; private set; }
        public bool IsRunning { get; private set; }
        public int ActiveChildId { get; private set; }

        public event Action<int>? TimeUpdated;
        public event Action? TimeExpired;

        public void Start(int childProfileId, int initialTimeSeconds)
        {
            lock (_lock)
            {
                ActiveChildId = childProfileId;
                CurrentTimeSeconds = initialTimeSeconds;
                IsRunning = true;

                _timer?.Dispose();
                _timer = new System.Threading.Timer(OnTimerTick, null, 1000, 1000);
            }
        }

        public void Stop()
        {
            lock (_lock)
            {
                IsRunning = false;
                _timer?.Dispose();
                _timer = null;
            }
        }

        private void OnTimerTick(object? state)
        {
            lock (_lock)
            {
                if (!IsRunning) return;

                if (CurrentTimeSeconds > 0)
                {
                    CurrentTimeSeconds--;
                    TimeUpdated?.Invoke(CurrentTimeSeconds);

                    if (CurrentTimeSeconds <= 0)
                    {
                        IsRunning = false;
                        _timer?.Dispose();
                        _timer = null;
                        TimeExpired?.Invoke();
                    }
                }
            }
        }
    }
}
