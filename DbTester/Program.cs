using System;
using LearnLock.Database;

try
{
    using var db = new LearnLockDbContext();
    Console.WriteLine($"ParentProfiles count: {db.ParentProfiles.Count()}");
    foreach (var p in db.ParentProfiles)
    {
        Console.WriteLine($"ID: {p.Id}, Email: {p.Email}, HasPassword: {!string.IsNullOrWhiteSpace(p.HashedPassword)}");
    }
    Console.WriteLine($"ChildProfiles count: {db.ChildProfiles.Count()}");
    foreach (var c in db.ChildProfiles)
    {
        Console.WriteLine($"Child ID: {c.Id}, Name: {c.Name}");
    }
}
catch (Exception ex)
{
    Console.WriteLine("Error: " + ex.Message);
}
