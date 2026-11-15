using System;
using System.Linq;
using LearnLock.Database;

try
{
    using var db = new LearnLockDbContext();
    Console.WriteLine("ParentProfiles count: " + db.ParentProfiles.Count());
    foreach (var p in db.ParentProfiles.ToList())
    {
        Console.WriteLine($"Parent: ID={p.Id}, Email={p.Email}");
    }

    Console.WriteLine("ChildProfiles count: " + db.ChildProfiles.Count());
    foreach (var c in db.ChildProfiles.ToList())
    {
        Console.WriteLine($"Child: ID={c.Id}, Name={c.Name}");
    }
}
catch (Exception ex)
{
    Console.WriteLine("Error: " + ex.ToString());
}
