using System;

namespace LearnLock.Core.Services
{
    public interface ITimerService
    {
        void Start(int childProfileId, int initialTimeSeconds);
        void Stop();
        event Action<int> TimeUpdated;
        event Action TimeExpired;
        int CurrentTimeSeconds { get; }
        bool IsRunning { get; }
        int ActiveChildId { get; }
    }
}
