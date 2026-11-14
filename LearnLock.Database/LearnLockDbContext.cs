using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using LearnLock.Core.Models;

namespace LearnLock.Database
{
    public class LearnLockDbContext : DbContext
    {
        public DbSet<ParentProfile> ParentProfiles { get; set; } = null!;
        public DbSet<ChildProfile> ChildProfiles { get; set; } = null!;
        public DbSet<TaskHistory> TaskHistories { get; set; } = null!;
        public DbSet<Achievement> Achievements { get; set; } = null!;

        public LearnLockDbContext()
        {
        }

        public LearnLockDbContext(DbContextOptions<LearnLockDbContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Place SQLite database in CommonApplicationData (C:\ProgramData\LearnLock) so all Windows accounts share the same config
                string appDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "LearnLock");
                try
                {
                    Directory.CreateDirectory(appDataFolder);
                }
                catch
                {
                    // Fallback to LocalApplicationData if CommonApplicationData has restricted permissions
                    appDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "LearnLock");
                    Directory.CreateDirectory(appDataFolder);
                }
                string dbPath = Path.Combine(appDataFolder, "learnlock_v5.db");
                optionsBuilder.UseSqlite($"Data Source={dbPath}");
            }
        }
    }
}
