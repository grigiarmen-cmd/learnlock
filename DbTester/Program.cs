using System;
using System.Linq;
using LearnLock.Database;
using LearnLock.Auth;

try
{
    using var db = new LearnLockDbContext();
    var parent = db.ParentProfiles.FirstOrDefault();
    if (parent != null)
    {
        string[] testPasswords = new string[] { "1234", "admin", "123456", "password", "LearnLock", "learnlock", "Grigor", "grigor", "Grigi", "grigi" };
        foreach (var p in testPasswords)
        {
            bool ok = PBKDF2Hasher.VerifyPassword(p, parent.HashedPassword, parent.Salt);
            if (ok)
            {
                Console.WriteLine($"MATCH FOUND: Password is '{p}'");
                return;
            }
        }
        Console.WriteLine("No standard password match found.");
    }
}
catch (Exception ex)
{
    Console.WriteLine("Error: " + ex.ToString());
}
