using System;

namespace LearnLock.Core.Models
{
    public class Achievement
    {
        public int Id { get; set; }
        public int ChildProfileId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty; // Fluent Icon Glyph (e.g. \xE76E)
        public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
    }
}
