using System.Threading.Tasks;

namespace LearnLock.Core.Services
{
    public interface IAiService
    {
        Task<string> GetCorrectionHintAsync(string subject, string question, string userAnswer, string correctAnswer);
    }
}
