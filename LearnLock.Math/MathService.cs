using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LearnLock.Core.Models;
using LearnLock.Core.Services;
using LearnLock.Database;

namespace LearnLock.Math
{
    public class MathService : IMathService
    {
        private readonly LearnLockDbContext _context;

        public MathService(LearnLockDbContext context)
        {
            _context = context;
        }

        public MathTask GenerateTaskForSubject(DifficultyLevel difficulty, string allowedSubjects)
        {
            // Parse allowed subjects
            var subjects = allowedSubjects.Split(';', StringSplitOptions.RemoveEmptyEntries)
                                           .Select(s => s.Trim())
                                           .ToList();
            if (subjects.Count == 0)
            {
                subjects.Add("Mathematik");
            }

            string chosenSubject = subjects[Random.Shared.Next(subjects.Count)];

            if (chosenSubject != "Mathematik")
            {
                return GenerateGeneralKnowledgeTask(chosenSubject);
            }

            // Math challenge generation
            var op = (MathOperator)Random.Shared.Next(0, 4); // Add, Sub, Mul, Div
            if (difficulty == DifficultyLevel.Hard || difficulty == DifficultyLevel.GymnasiumGrade9)
            {
                op = (MathOperator)Random.Shared.Next(0, 5); // Allow Exponentiation
            }

            int operand1 = 0;
            int operand2 = 0;
            int correctAnswer = 0;

            switch (op)
            {
                case MathOperator.Addition:
                    if (difficulty == DifficultyLevel.Easy)
                    {
                        operand1 = Random.Shared.Next(1, 10);
                        operand2 = Random.Shared.Next(1, 10);
                    }
                    else if (difficulty == DifficultyLevel.Medium)
                    {
                        operand1 = Random.Shared.Next(10, 50);
                        operand2 = Random.Shared.Next(10, 50);
                    }
                    else
                    {
                        operand1 = Random.Shared.Next(50, 500);
                        operand2 = Random.Shared.Next(50, 500);
                    }
                    correctAnswer = operand1 + operand2;
                    break;

                case MathOperator.Subtraction:
                    if (difficulty == DifficultyLevel.Easy)
                    {
                        operand1 = Random.Shared.Next(5, 20);
                        operand2 = Random.Shared.Next(1, operand1);
                    }
                    else if (difficulty == DifficultyLevel.Medium)
                    {
                        operand1 = Random.Shared.Next(20, 100);
                        operand2 = Random.Shared.Next(10, operand1);
                    }
                    else
                    {
                        operand1 = Random.Shared.Next(100, 1000);
                        operand2 = Random.Shared.Next(50, operand1);
                    }
                    correctAnswer = operand1 - operand2;
                    break;

                case MathOperator.Multiplication:
                    if (difficulty == DifficultyLevel.Easy)
                    {
                        operand1 = Random.Shared.Next(1, 5);
                        operand2 = Random.Shared.Next(1, 5);
                    }
                    else if (difficulty == DifficultyLevel.Medium)
                    {
                        operand1 = Random.Shared.Next(2, 10);
                        operand2 = Random.Shared.Next(2, 10);
                    }
                    else
                    {
                        operand1 = Random.Shared.Next(10, 20);
                        operand2 = Random.Shared.Next(5, 15);
                    }
                    correctAnswer = operand1 * operand2;
                    break;

                case MathOperator.Division:
                    if (difficulty == DifficultyLevel.Easy)
                    {
                        operand2 = Random.Shared.Next(1, 5);
                        correctAnswer = Random.Shared.Next(1, 5);
                    }
                    else if (difficulty == DifficultyLevel.Medium)
                    {
                        operand2 = Random.Shared.Next(2, 10);
                        correctAnswer = Random.Shared.Next(2, 10);
                    }
                    else
                    {
                        operand2 = Random.Shared.Next(5, 15);
                        correctAnswer = Random.Shared.Next(5, 20);
                    }
                    operand1 = correctAnswer * operand2;
                    break;

                case MathOperator.Exponentiation:
                    // Easy exponent base
                    int baseVal = Random.Shared.Next(2, 4); 
                    int exponent = Random.Shared.Next(2, 4); // 2^2, 2^3, 3^2, 3^3
                    operand1 = baseVal;
                    operand2 = (int)System.Math.Pow(baseVal, exponent);
                    correctAnswer = exponent; // Find x in baseVal^x = operand2
                    break;
            }

            return new MathTask
            {
                Subject = "Mathematik",
                Operand1 = operand1,
                Operand2 = operand2,
                Operator = op,
                CorrectAnswer = correctAnswer
            };
        }

        private MathTask GenerateGeneralKnowledgeTask(string subject)
        {
            // Simple hardcoded database of general knowledge tasks per requested subjects
            var list = new List<(string Question, string Options, int CorrectIdx)>();

            switch (subject.ToLower())
            {
                case "deutsch":
                    list.Add(("Was ist das Gegenteil von 'hell'?", "weiß;schwarz;dunkel;blau", 2));
                    list.Add(("Welches Wort ist ein Substantiv (Nomen)?", "gehen;schnell;Haus;schön", 2));
                    break;
                case "englisch":
                    list.Add(("What is the past tense of 'go'?", "go;went;gone;going", 1));
                    list.Add(("Translate: 'Apfel'", "Orange;Apple;Banana;Pear", 1));
                    break;
                case "spanisch":
                    list.Add(("Wie sagt man 'danke' auf Spanisch?", "Por favor;Gracias;Hola;Adiós", 1));
                    list.Add(("Was bedeutet 'El libro'?", "Der Stift;Das Buch;Die Schule;Der Tisch", 1));
                    break;
                case "französisch":
                    list.Add(("Wie sagt man 'Guten Tag' auf Französisch?", "Bonjour;Salut;Merci;Au revoir", 0));
                    list.Add(("Was bedeutet 'La pomme'?", "Die Banane;Die Birne;Der Apfel;Die Erdbeere", 2));
                    break;
                case "sport":
                    list.Add(("Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?", "10;11;12;9", 1));
                    list.Add(("Wie lang ist die Laufdistanz bei einem Marathon?", "21 km;42 km;10 km;50 km", 1));
                    break;
                case "religion":
                    list.Add(("Wie heißt das heilige Buch des Islams?", "Bibel;Tora;Koran;Veden", 2));
                    list.Add(("In welcher Stadt wurde Jesus geboren?", "Jerusalem;Rom;Nazareth;Betlehem", 3));
                    break;
                case "biologie":
                    list.Add(("Welches Organ pumpt Blut durch den Körper?", "Lunge;Gehirn;Herz;Leber", 2));
                    list.Add(("Welches Tier legt Eier?", "Hund;Katze;Huhn;Elefant", 2));
                    break;
                case "chemie":
                    list.Add(("Was ist die chemische Formel für Wasser?", "CO2;H2O;NaCl;O2", 1));
                    list.Add(("Welches Gas atmen Menschen aus?", "Sauerstoff;Stickstoff;Kohlendioxid;Helium", 2));
                    break;
                default:
                    list.Add(($"Allgemeinwissen: Was ergibt 12 + 13?", "20;25;30;15", 1));
                    break;
            }

            var item = list[Random.Shared.Next(list.Count)];
            return new MathTask
            {
                Subject = subject,
                CustomQuestion = item.Question,
                Options = item.Options,
                CorrectAnswer = item.CorrectIdx
            };
        }

        public bool VerifyAnswer(MathTask task, int userAnswer)
        {
            return task.CorrectAnswer == userAnswer;
        }

        public int GetRewardTimeSeconds(DifficultyLevel difficulty, bool isCorrect)
        {
            if (!isCorrect)
            {
                return 0;
            }

            // Award 15 minutes of playtime per resolved challenge session
            return 15 * 60;
        }

        public async Task SaveTaskHistoryAsync(int childProfileId, MathTask task, int userAnswer, bool isCorrect, int earnedTimeSeconds)
        {
            var history = new TaskHistory
            {
                ChildProfileId = childProfileId,
                Subject = task.Subject,
                Operator = task.Operator,
                Operand1 = task.Operand1,
                Operand2 = task.Operand2,
                UserAnswer = userAnswer,
                CorrectAnswer = task.CorrectAnswer,
                IsCorrect = isCorrect,
                EarnedTimeSeconds = earnedTimeSeconds,
                SolvedAt = DateTime.UtcNow
            };

            _context.TaskHistories.Add(history);
            await _context.SaveChangesAsync();

            if (isCorrect)
            {
                await CheckAndAwardAchievementsAsync(childProfileId);
            }
        }

        public async Task<List<TaskHistory>> GetTaskHistoryAsync(int childProfileId)
        {
            return await _context.TaskHistories
                                 .Where(h => h.ChildProfileId == childProfileId)
                                 .OrderByDescending(h => h.SolvedAt)
                                 .ToListAsync();
        }

        public async Task<List<Achievement>> GetAchievementsAsync(int childProfileId)
        {
            return await _context.Achievements
                                 .Where(a => a.ChildProfileId == childProfileId)
                                 .ToListAsync();
        }

        public async Task CheckAndAwardAchievementsAsync(int childProfileId)
        {
            var histories = await _context.TaskHistories
                                          .Where(h => h.ChildProfileId == childProfileId && h.IsCorrect)
                                          .ToListAsync();
            int totalCorrect = histories.Count;

            var existing = await _context.Achievements
                                         .Where(a => a.ChildProfileId == childProfileId)
                                         .Select(a => a.Name)
                                         .ToListAsync();

            async Task Award(string name, string desc, string icon)
            {
                if (!existing.Contains(name))
                {
                    var ach = new Achievement
                    {
                        ChildProfileId = childProfileId,
                        Name = name,
                        Description = desc,
                        Icon = icon,
                        UnlockedAt = DateTime.UtcNow
                    };
                    _context.Achievements.Add(ach);
                    await _context.SaveChangesAsync();
                }
            }

            if (totalCorrect >= 1)
            {
                await Award("Erster Schritt", "Erste Aufgabe erfolgreich gelöst!", "\xE76E");
            }
            if (totalCorrect >= 10)
            {
                await Award("Lern-Profi", "10 Aufgaben gelöst!", "\xE7FC");
            }
            if (totalCorrect >= 50)
            {
                await Award("Unschlagbar", "50 Aufgaben gelöst!", "\xE735");
            }
        }
    }
}
