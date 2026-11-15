using System.Collections.Generic;
using System.Threading.Tasks;
using LearnLock.Core.Models;

namespace LearnLock.Core.Services
{
    public interface IMathService
    {
        MathTask GenerateTaskForSubject(DifficultyLevel difficulty, string allowedSubjects, int schoolGrade = 5);
        bool VerifyAnswer(MathTask task, int userAnswer);
        int GetRewardTimeSeconds(DifficultyLevel difficulty, bool isCorrect);
        Task SaveTaskHistoryAsync(int childProfileId, MathTask task, int userAnswer, bool isCorrect, int earnedTimeSeconds);
        Task<List<TaskHistory>> GetTaskHistoryAsync(int childProfileId);
        Task<List<Achievement>> GetAchievementsAsync(int childProfileId);
        Task CheckAndAwardAchievementsAsync(int childProfileId);
    }
}
