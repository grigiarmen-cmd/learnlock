namespace LearnLock.Core.Models
{
    public class MathTask
    {
        public string Subject { get; set; } = "Mathematik";
        public int Operand1 { get; set; }
        public int Operand2 { get; set; }
        public MathOperator Operator { get; set; }
        public int CorrectAnswer { get; set; }
        public string CustomQuestion { get; set; } = string.Empty;
        public string Options { get; set; } = string.Empty; // Semicolon-separated MC answers if applicable
    }
}
