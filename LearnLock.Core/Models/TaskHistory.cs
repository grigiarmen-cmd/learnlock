using System;

namespace LearnLock.Core.Models
{
    public class TaskHistory
    {
        public int Id { get; set; }
        public int ChildProfileId { get; set; }
        public string Subject { get; set; } = "Mathematik";
        public MathOperator Operator { get; set; }
        public int Operand1 { get; set; }
        public int Operand2 { get; set; }
        public int UserAnswer { get; set; }
        public int CorrectAnswer { get; set; }
        public bool IsCorrect { get; set; }
        public int EarnedTimeSeconds { get; set; }
        public DateTime SolvedAt { get; set; } = DateTime.UtcNow;
    }
}
