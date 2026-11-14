using System;
using System.Collections.Generic;

namespace LearnLock_App
{
    public static class LanguageManager
    {
        public static string CurrentLanguage { get; private set; } = "de";

        private static readonly Dictionary<string, Dictionary<string, string>> Translations = new()
        {
            ["de"] = new()
            {
                ["WhoIsLearning"] = "Wer lernt heute?",
                ["ParentArea"] = "Elternbereich",
                ["LoginBtn"] = "Anmelden",
                ["ParentPasswordPlaceholder"] = "Eltern-Passwort eingeben",
                ["PleaseEnterPassword"] = "Bitte Passwort eingeben.",
                ["InvalidPassword"] = "Ungültiges Eltern-Passwort.",
                ["NoChildrenText"] = "Noch keine Kinderprofile angelegt. Melden Sie sich als Elternteil an, um ein Profil zu erstellen.",
                ["ErrorLoadingProfiles"] = "Fehler beim Laden der Profile."
            },
            ["en"] = new()
            {
                ["WhoIsLearning"] = "Who is learning today?",
                ["ParentArea"] = "Parent Dashboard",
                ["LoginBtn"] = "Login",
                ["ParentPasswordPlaceholder"] = "Enter parent password",
                ["PleaseEnterPassword"] = "Please enter password.",
                ["InvalidPassword"] = "Invalid parent password.",
                ["NoChildrenText"] = "No child profiles created yet. Log in as parent to create a profile.",
                ["ErrorLoadingProfiles"] = "Error loading profiles."
            }
        };

        public static void SetLanguage(string lang)
        {
            if (lang == "de" || lang == "en")
            {
                CurrentLanguage = lang;
            }
        }

        public static string GetString(string key)
        {
            if (Translations.TryGetValue(CurrentLanguage, out var dict) && dict.TryGetValue(key, out var val))
            {
                return val;
            }
            return key;
        }
    }
}
