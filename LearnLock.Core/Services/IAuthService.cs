using System.Collections.Generic;
using System.Threading.Tasks;
using LearnLock.Core.Models;

namespace LearnLock.Core.Services
{
    public interface IAuthService
    {
        Task<bool> HasParentAccountAsync();
        Task<bool> RegisterParentAsync(string password, string email);
        Task<bool> VerifyParentPasswordAsync(string password);
        Task<List<ChildProfile>> GetChildrenAsync();
        Task<ChildProfile> CreateChildAsync(string name, DifficultyLevel difficulty, int dailyLimitSeconds, int schoolGrade, string blockedApps, int currentTimeBalanceSeconds = 0);
        Task UpdateChildAsync(ChildProfile child);
        Task DeleteChildAsync(int childId);
        Task<ParentProfile?> GetParentProfileAsync();
        Task UpdateParentProfileAsync(ParentProfile parent);
        Task<bool> ChangeParentPasswordAsync(string oldPassword, string newPassword);
        Task<bool> ResetParentPasswordAsync(string newPassword);
        Task<bool> SendOtpCodeAsync(string email, string code);
        Task<bool> SendPasswordResetCodeAsync(string email, string code);
    }
}
