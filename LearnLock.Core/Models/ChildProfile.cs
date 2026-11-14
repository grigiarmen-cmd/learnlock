namespace LearnLock.Core.Models
{
    public class ChildProfile
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DifficultyLevel DifficultyLevel { get; set; } = DifficultyLevel.Easy;
        public int DailyLimitSeconds { get; set; }
        public int CurrentTimeBalanceSeconds { get; set; }
        public int SchoolGrade { get; set; }
        public string BlockedApps { get; set; } = string.Empty; // Semicolon-separated process list
        public string AllowedSubjects { get; set; } = "Mathematik"; // Semicolon-separated subjects allowed
        
        public int DailyLimitMinutes => DailyLimitSeconds / 60;
    }
}
