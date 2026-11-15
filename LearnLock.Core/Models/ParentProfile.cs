namespace LearnLock.Core.Models
{
    public class ParentProfile
    {
        public int Id { get; set; }
        public string HashedPassword { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ResendApiKey { get; set; } = string.Empty;
        public SubscriptionTier Tier { get; set; } = SubscriptionTier.Free;
        public string GlobalBlockedApps { get; set; } = string.Empty;
        public string GlobalBlockedKeywords { get; set; } = string.Empty;
        public string LockedFreeSubject { get; set; } = string.Empty;
        public bool IsAIAssistantEnabled { get; set; } = true;
        public string ProtectedWindowsUsers { get; set; } = string.Empty;
        public bool IsBanned { get; set; } = false;
        public System.DateTime? SubscriptionExpiration { get; set; }
    }
}
