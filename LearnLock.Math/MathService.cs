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

        public MathTask GenerateTaskForSubject(DifficultyLevel difficulty, string allowedSubjects, int schoolGrade = 5)
        {
            if (schoolGrade < 1) schoolGrade = 1;
            if (schoolGrade > 13) schoolGrade = 13;

            // Parse allowed subjects
            var subjects = allowedSubjects.Split(';', StringSplitOptions.RemoveEmptyEntries)
                                           .Select(s => s.Trim())
                                           .ToList();
            if (subjects.Count == 0)
            {
                subjects.Add("Mathematik");
            }

            string chosenSubject = subjects[Random.Shared.Next(subjects.Count)];

            if (!chosenSubject.Equals("Mathematik", StringComparison.OrdinalIgnoreCase))
            {
                return GenerateCurriculumTask(chosenSubject, schoolGrade, difficulty);
            }

            return GenerateCurriculumMathTask(schoolGrade, difficulty);
        }

        private MathTask GenerateCurriculumMathTask(int grade, DifficultyLevel difficulty)
        {
            // Fachanforderungen Mathematik SH:
            // Stufen 1-2: Grundrechenarten bis 20/100, Zehnerübergang
            // Stufen 3-4: 1x1, Division, Zahlenraum bis 1.000 / 10.000
            // Stufen 5-6: Bruchrechnung, Punkt-vor-Strich, Teiler, negative Zahlen Einführung
            // Stufen 7-8: Rationale Zahlen, Prozentrechnung, lineare Gleichungen (x + a = b), Potenzen
            // Stufen 9-10: Quadratische Gleichungen, Satz des Pythagoras, Wurzeln, Binomische Formeln, Trigonometrie

            if (grade <= 2)
            {
                // Addition/Subtraktion bis 20
                bool isAdd = Random.Shared.Next(2) == 0;
                if (isAdd)
                {
                    int op1 = Random.Shared.Next(1, 15);
                    int op2 = Random.Shared.Next(1, 20 - op1 + 1);
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        Operand1 = op1,
                        Operand2 = op2,
                        Operator = MathOperator.Addition,
                        CorrectAnswer = op1 + op2
                    };
                }
                else
                {
                    int op1 = Random.Shared.Next(5, 20);
                    int op2 = Random.Shared.Next(1, op1 + 1);
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        Operand1 = op1,
                        Operand2 = op2,
                        Operator = MathOperator.Subtraction,
                        CorrectAnswer = op1 - op2
                    };
                }
            }
            else if (grade <= 4)
            {
                // Kleines 1x1 oder Addition/Subtraktion bis 100
                int type = Random.Shared.Next(3);
                if (type == 0)
                {
                    int op1 = Random.Shared.Next(2, 10);
                    int op2 = Random.Shared.Next(2, 10);
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        Operand1 = op1,
                        Operand2 = op2,
                        Operator = MathOperator.Multiplication,
                        CorrectAnswer = op1 * op2
                    };
                }
                else if (type == 1)
                {
                    int op2 = Random.Shared.Next(2, 10);
                    int ans = Random.Shared.Next(2, 10);
                    int op1 = ans * op2;
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        Operand1 = op1,
                        Operand2 = op2,
                        Operator = MathOperator.Division,
                        CorrectAnswer = ans
                    };
                }
                else
                {
                    int op1 = Random.Shared.Next(20, 80);
                    int op2 = Random.Shared.Next(10, 100 - op1);
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        Operand1 = op1,
                        Operand2 = op2,
                        Operator = MathOperator.Addition,
                        CorrectAnswer = op1 + op2
                    };
                }
            }
            else if (grade <= 6)
            {
                // Klassen 5-6: Größere Multiplikation, Teilbarkeit, Punkt-vor-Strich Multiple Choice
                int mode = Random.Shared.Next(3);
                if (mode == 0)
                {
                    // Punkt-vor-Strich: a + b * c
                    int a = Random.Shared.Next(5, 30);
                    int b = Random.Shared.Next(2, 8);
                    int c = Random.Shared.Next(2, 8);
                    int correct = a + (b * c);
                    int wrong1 = (a + b) * c;
                    int wrong2 = correct + 5;
                    int wrong3 = System.Math.Max(1, correct - 10);
                    return BuildMultipleChoice("Mathematik", $"Berechne unter Beachtung von Punkt-vor-Strich: {a} + {b} · {c} = ?", correct, wrong1, wrong2, wrong3);
                }
                else if (mode == 1)
                {
                    // Teiler / kgV / ggT
                    var list = new List<(string Q, string O, int A)>
                    {
                        ("Was ist der größte gemeinsame Teiler (ggT) von 12 und 18?", "2;3;6;9", 2),
                        ("Was ist das kleinste gemeinsame Vielfache (kgV) von 4 und 6?", "12;24;8;18", 0),
                        ("Welche der folgenden Zahlen ist eine Primzahl?", "9;15;21;17", 3),
                        ("Wie viel sind 3/4 von 100?", "25;50;75;80", 2),
                        ("Berechne: 1/2 + 1/4 = ?", "2/6;3/4;1/4;2/4", 1)
                    };
                    var item = list[Random.Shared.Next(list.Count)];
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        CustomQuestion = item.Q,
                        Options = item.O,
                        CorrectAnswer = item.A
                    };
                }
                else
                {
                    // Multiplikation zweistellig
                    int op1 = Random.Shared.Next(11, 25);
                    int op2 = Random.Shared.Next(3, 12);
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        Operand1 = op1,
                        Operand2 = op2,
                        Operator = MathOperator.Multiplication,
                        CorrectAnswer = op1 * op2
                    };
                }
            }
            else if (grade <= 8)
            {
                // Klassen 7-8: Lineare Gleichungen, negative Zahlen, Potenzen, Prozentrechnung
                int mode = Random.Shared.Next(3);
                if (mode == 0)
                {
                    // Lineare Gleichung: x + a = b  => x = ?
                    int a = Random.Shared.Next(12, 50);
                    int x = Random.Shared.Next(5, 40);
                    int b = x + a;
                    int wrong1 = b + a;
                    int wrong2 = x + 3;
                    int wrong3 = System.Math.Max(1, x - 4);
                    return BuildMultipleChoice("Mathematik", $"Löse nach x auf:  x + {a} = {b}", x, wrong1, wrong2, wrong3);
                }
                else if (mode == 1)
                {
                    // Prozentrechnung
                    var list = new List<(string Q, string O, int A)>
                    {
                        ("Wie viel sind 20 % von 250 €?", "25 €;50 €;40 €;20 €", 1),
                        ("Wie viel sind 15 % von 200 m?", "15 m;30 m;45 m;25 m", 1),
                        ("Berechne: (-7) + (-15) = ?", "-22;-8;22;8", 0),
                        ("Berechne: (-6) · (-8) = ?", "-48;48;-14;14", 1),
                        ("Was ist der Wert von 2³ (2 hoch 3)?", "6;8;9;16", 1),
                        ("Was ist 5²?", "10;20;25;50", 2)
                    };
                    var item = list[Random.Shared.Next(list.Count)];
                    return new MathTask
                    {
                        Subject = "Mathematik",
                        CustomQuestion = item.Q,
                        Options = item.O,
                        CorrectAnswer = item.A
                    };
                }
                else
                {
                    // Lineare Gleichung 2: a * x = b
                    int a = Random.Shared.Next(3, 9);
                    int x = Random.Shared.Next(4, 15);
                    int b = a * x;
                    int wrong1 = x + 2;
                    int wrong2 = x - 2;
                    int wrong3 = b - a;
                    return BuildMultipleChoice("Mathematik", $"Löse die Gleichung nach x auf:  {a} · x = {b}", x, wrong1, wrong2, wrong3);
                }
            }
            else
            {
                // Klassen 9-10+ (Mittlerer Schulabschluss & Gymnasium SH)
                // Pythagoras, Wurzeln, quadratische Gleichungen, Binomische Formeln
                var list = new List<(string Q, string O, int A)>
                {
                    ("Satz des Pythagoras: Im rechtwinkligen Dreieck mit a=3 und b=4 ist die Hypotenuse c = ?", "5;7;6;12", 0),
                    ("Satz des Pythagoras: Bei Katheten a=6 und b=8 beträgt c = ?", "14;10;12;11", 1),
                    ("Was ist die Quadratwurzel aus 144 (√144)?", "11;12;14;16", 1),
                    ("Was ist die Quadratwurzel aus 196 (√196)?", "12;13;14;15", 2),
                    ("Löse die quadratische Gleichung: x² = 81", "x = 9 und x = -9;x = 9;x = 18;x = 40.5", 0),
                    ("Erste binomische Formel: (a + b)² = ?", "a² + b²;a² + 2ab + b²;a² - 2ab + b²;2a + 2b", 1),
                    ("Dritte binomische Formel: (a + b)(a - b) = ?", "a² + b²;a² - 2ab;a² - b²;(a - b)²", 2),
                    ("Wie lautet die pq-Formel zur Nullstellenberechnung von x² + px + q = 0?", "-p/2 ± √((p/2)² - q);-p ± √(p² - 4q);p/2 ± √(q - p);-q ± √(p²)", 0),
                    ("Welche Steigung m hat die lineare Funktion f(x) = 3x - 5?", "-5;3;5;1/3", 1),
                    ("Was ist der Wert von log₁₀(1000)?", "100;10;3;2", 2)
                };
                var item = list[Random.Shared.Next(list.Count)];
                return new MathTask
                {
                    Subject = "Mathematik",
                    CustomQuestion = item.Q,
                    Options = item.O,
                    CorrectAnswer = item.A
                };
            }
        }

        private MathTask GenerateCurriculumTask(string subject, int grade, DifficultyLevel difficulty)
        {
            var list = new List<(string Question, string Options, int CorrectIdx)>();

            switch (subject.ToLowerInvariant())
            {
                case "deutsch":
                    if (grade <= 4)
                    {
                        list.Add(("Welches Wort ist ein Nomen (Namenwort)?", "laufen;groß;Haus;schnell", 2));
                        list.Add(("Welches Wort ist ein Adjektiv (Wiewort)?", "Baum;bunt;spielen;Hund", 1));
                        list.Add(("Welches Wort ist ein Verb (Tunwort)?", "schwimmen;Fenster;blau;Schule", 0));
                        list.Add(("Wie trennt man das Wort 'Sommer' richtig?", "Som-mer;So-mmer;Somm-er;S-ommer", 0));
                        list.Add(("Welches Satzzeichen gehört an das Ende einer Frage?", "Ausrufezeichen;Punkt;Fragezeichen;Komma", 2));
                    }
                    else if (grade <= 7)
                    {
                        list.Add(("In welcher Zeitform steht: 'Er spielte gestern Fußball'?", "Präsens;Präteritum;Perfekt;Futur I", 1));
                        list.Add(("In welcher Zeitform steht: 'Wir haben gelernt'?", "Präsens;Präteritum;Perfekt;Plusquamperfekt", 2));
                        list.Add(("Was ist das Subjekt in: 'Der Hund bellt laut im Garten'?", "bellt;laut;Der Hund;im Garten", 2));
                        list.Add(("Welches ist eine Konjunktion (Bindewort)?", "weil;schnell;schön;Tisch", 0));
                        list.Add(("Welches Wort schreibt man mit doppeltem 's' (ss)?", "Flu...;Stra...e;gro...;wei...", 0));
                    }
                    else
                    {
                        // Klassen 8-10+ (Fachanforderungen SH: Rhetorische Stilmittel, Konjunktiv, Textsorten)
                        list.Add(("Welches rhetorische Stilmittel liegt vor bei: 'Milch macht müde Männer munter'?", "Metapher;Alliteration;Oxymoron;Hyperbel", 1));
                        list.Add(("Was bedeutet die Metapher: 'Rabeneltern'?", "Eltern, die Vögel lieben;Verwahrlosende/lieblose Eltern;Sehr strenge Eltern;Großeltern", 1));
                        list.Add(("In welchem Modus steht der Satz: 'Wenn ich Zeit hätte, käme ich'?", "Indikativ;Imperativ;Konjunktiv II;Konjunktiv I", 2));
                        list.Add(("Was versteht man unter einer Antithese?", "Eine extreme Übertreibung;Ein Widerspruch in Begriffen;Die Gegenüberstellung gegensätzlicher Gedanken;Ein Lautmalerisches Wort", 2));
                        list.Add(("Welcher Texttyp verfolgt das Ziel, Thesen mit Argumenten und Belegen zu untermauern?", "Gedicht;Erörterung;Märchen;Anekdote", 1));
                    }
                    break;

                case "englisch":
                    if (grade <= 4)
                    {
                        list.Add(("Translate: 'Hund'", "Cat;Dog;Bird;Fish", 1));
                        list.Add(("Translate: 'Rot'", "Blue;Green;Yellow;Red", 3));
                        list.Add(("How do you say 'Guten Morgen' in English?", "Good night;Good evening;Good morning;Goodbye", 2));
                        list.Add(("What is 'one, two, three' in German?", "eins, zwei, drei;vier, fünf, sechs;sieben, acht, neun;zehn, elf, zwölf", 0));
                    }
                    else if (grade <= 7)
                    {
                        list.Add(("What is the simple past form of 'go'?", "goed;gone;went;going", 2));
                        list.Add(("What is the past participle of 'see'?", "saw;seen;seeing;sees", 1));
                        list.Add(("Complete the sentence: 'She ___ to school every day.'", "go;goes;went;going", 1));
                        list.Add(("Which word is a question word?", "Because;When;Quickly;Always", 1));
                        list.Add(("Which pronoun is correct: 'This book belongs to Peter. It is ___.'", "his;him;her;hers", 0));
                    }
                    else
                    {
                        // Klassen 8-10+ (Conditional Clauses, Passive Voice, Advanced Grammar)
                        list.Add(("If-Clause Type 1: 'If it rains tomorrow, we ___ at home.'", "stay;will stay;would stay;stayed", 1));
                        list.Add(("If-Clause Type 2: 'If I ___ a million dollars, I would travel the world.'", "have;had;would have;will have", 1));
                        list.Add(("Transform to Passive Voice: 'Shakespeare wrote Hamlet.'", "Hamlet was written by Shakespeare.;Hamlet is written by Shakespeare.;Hamlet wrote Shakespeare.;Shakespeare was written.", 0));
                        list.Add(("Choose the correct antonym of 'generous':", "kind;mean / stingy;wealthy;polite", 1));
                        list.Add(("Complete: 'He prevented me ___ making a terrible mistake.'", "to;from;for;with", 1));
                    }
                    break;

                case "biologie":
                    if (grade <= 6)
                    {
                        list.Add(("Welches Organ pumpt sauerstoffreiches Blut durch unseren Körper?", "Lunge;Gehirn;Herz;Magen", 2));
                        list.Add(("Welcher Teil der Pflanze nimmt Wasser und Mineralstoffe aus dem Boden auf?", "Blüte;Blatt;Stängel;Wurzel", 3));
                        list.Add(("Zu welcher Tierklasse gehören Vögel?", "Wirbeltiere;Wirbellose;Insekten;Spinnentiere", 0));
                    }
                    else
                    {
                        // Klassen 7-10 (Photosynthese, Genetik, Ökologie, Zellbiologie)
                        list.Add(("Was produzieren Pflanzen während der Fotosynthese neben Sauerstoff?", "Kohlendioxid;Glucose (Zucker);Stickstoff;Wasserstoff", 1));
                        list.Add(("Wie heißt der grüne Blattfarbstoff, der Lichtenergie absorbiert?", "Carotin;Melanin;Chlorophyll;Hämoglobin", 2));
                        list.Add(("Wo befindet sich die genetische Erbinformation (DNA) in einer pflanzlichen Zelle?", "Im Zellkern;In der Vakuole;In der Zellwand;Im Ribosom", 0));
                        list.Add(("Wie nennt man die Kraftwerke der Zelle, die ATP-Energie bereitstellen?", "Ribosomen;Mitochondrien;Golgi-Apparat;Chloroplasten", 1));
                        list.Add(("Welche Chromosomenpaarung bestimmt beim Menschen das männliche Geschlecht?", "XX;XY;YY;XO", 1));
                    }
                    break;

                case "chemie":
                    if (grade <= 7)
                    {
                        list.Add(("Was ist die chemische Summenformel von reinem Wasser?", "CO2;H2O;NaCl;O2", 1));
                        list.Add(("Welches Gas in der Luft atmen Menschen lebensnotwendig ein?", "Stickstoff;Helium;Sauerstoff;Kohlendioxid", 2));
                        list.Add(("Welcher Aggregatzustand entsteht beim Verdampfen von flüssigem Wasser?", "Fest;Gasförmig;Plasma;Kristallin", 1));
                    }
                    else
                    {
                        // Klassen 8-10 (Periodensystem, Bindungen, Säuren/Basen, Redox)
                        list.Add(("Welches chemische Elementsymbol steht für Kochsalz (Natriumchlorid)?", "NaCl;HCl;NaOH;KCl", 0));
                        list.Add(("Welchen pH-Wert hat eine neutrale wässrige Lösung bei 25 °C?", "0;7;14;1", 1));
                        list.Add(("Welche Ladung tragen die Elektronen in der Atomhülle?", "Positiv;Negativ;Neutral;Keine", 1));
                        list.Add(("Welches chemische Symbol steht für Gold?", "Ag;Au;Fe;Cu", 1));
                        list.Add(("Welches Element hat die Ordnungszahl 1 im Periodensystem?", "Helium;Sauerstoff;Wasserstoff;Kohlenstoff", 2));
                    }
                    break;

                case "geschichte":
                    if (grade <= 6)
                    {
                        list.Add(("In welchem Zeitalter lebten die Menschen als Jäger und Sammler?", "Steinzeit;Neuzeit;Industriezeitalter;Moderne", 0));
                        list.Add(("Wie nannte man die Herrscher im antiken Ägypten?", "Kaiser;Könige;Pharaonen;Zaren", 2));
                    }
                    else
                    {
                        // Klassen 7-10 (Mittelalter, Französische Revolution, Weimar, Weltkriege, Mauerfall)
                        list.Add(("In welchem Jahr begann die Französische Revolution mit dem Sturm auf die Bastille?", "1492;1789;1848;1914", 1));
                        list.Add(("In welchem Zeitraum fand der Erste Weltkrieg statt?", "1914 – 1918;1939 – 1945;1870 – 1871;1900 – 1905", 0));
                        list.Add(("In welchem Jahr fiel die Berliner Mauer?", "1980;1989;1990;1995", 1));
                        list.Add(("Wie hieß die erste deutsche Demokratie nach dem Ersten Weltkrieg?", "Bundesrepublik;Weimarer Republik;Preußische Republik;Deutscher Bund", 1));
                        list.Add(("In welchem Jahr endete der Zweite Weltkrieg in Europa?", "1918;1939;1945;1949", 2));
                    }
                    break;

                case "geographie":
                case "erdkunde":
                    if (grade <= 6)
                    {
                        list.Add(("Wie heißt die Hauptstadt der Bundesrepublik Deutschland?", "München;Hamburg;Berlin;Köln", 2));
                        list.Add(("Welcher Ozean liegt zwischen Europa und Amerika?", "Pazifischer Ozean;Atlantischer Ozean;Indischer Ozean;Arktischer Ozean", 1));
                        list.Add(("Wie viele Kontinente gibt es auf der Erde?", "5;7;10;4", 1));
                    }
                    else
                    {
                        list.Add(("Welches ist das flächenmäßig größte Land der Erde?", "Kanada;USA;Russland;China", 2));
                        list.Add(("Welches ist der längste Fluss Afrikas?", "Kongo;Nil;Amazonas;Sambesi", 1));
                        list.Add(("Wie nennt man die Schalenverschiebung der Erdkruste?", "Erosion;Plattentektonik;Sedimentation;Glazialmorphologie", 1));
                        list.Add(("An welcher Meeresküste liegt das Bundesland Schleswig-Holstein?", "Nur Nordsee;Nord- und Ostsee;Nur Ostsee;Mittelmeer", 1));
                        list.Add(("Welcher Breitengrad teilt die Erde in Nord- und Südhalbkugel?", "Nullmeridian;Wendekreis;Äquator;Polarkreis", 2));
                    }
                    break;

                default:
                    list.Add(($"Allgemeinwissen: Was ist die Hauptstadt von Deutschland?", "München;Berlin;Hamburg;Frankfurt", 1));
                    list.Add(($"Allgemeinwissen: Wie viele Bundesländer hat Deutschland?", "12;14;16;18", 2));
                    break;
            }

            var selected = list[Random.Shared.Next(list.Count)];
            return new MathTask
            {
                Subject = subject,
                CustomQuestion = selected.Question,
                Options = selected.Options,
                CorrectAnswer = selected.CorrectIdx
            };
        }

        private static MathTask BuildMultipleChoice(string subject, string question, int correct, int wrong1, int wrong2, int wrong3)
        {
            var answers = new List<int> { correct, wrong1, wrong2, wrong3 };
            // Ensure 4 unique numbers
            int salt = 1;
            while (answers.Distinct().Count() < 4)
            {
                answers[3] = correct + salt * 7;
                salt++;
            }

            // Shuffle
            var shuffled = answers.OrderBy(_ => Random.Shared.Next()).ToList();
            int correctIndex = shuffled.IndexOf(correct);

            return new MathTask
            {
                Subject = subject,
                CustomQuestion = question,
                Options = string.Join(";", shuffled),
                CorrectAnswer = correctIndex
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
