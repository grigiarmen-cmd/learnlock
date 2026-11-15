using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LearnLock.Core.Models;
using LearnLock.Core.Services;
using LearnLock.Database;

namespace LearnLock.Auth
{
    public class AuthService : IAuthService
    {
        private readonly LearnLockDbContext _context;
        private static readonly HttpClient _httpClient = new HttpClient();

        public AuthService(LearnLockDbContext context)
        {
            _context = context;
            _context.Database.EnsureCreated();

            // Parent profile is created without hardcoded API keys
            var parent = _context.ParentProfiles.FirstOrDefault();
            if (parent == null)
            {
                _context.ParentProfiles.Add(new ParentProfile());
                _context.SaveChanges();
            }
        }

        public async Task<bool> HasParentAccountAsync()
        {
            var parent = await _context.ParentProfiles.FirstOrDefaultAsync();
            return parent != null && !string.IsNullOrWhiteSpace(parent.HashedPassword);
        }

        public async Task<bool> RegisterParentAsync(string password, string email)
        {
            var parent = await _context.ParentProfiles.FirstOrDefaultAsync();
            var (hash, salt) = PBKDF2Hasher.HashPassword(password);

            if (parent != null)
            {
                parent.HashedPassword = hash;
                parent.Salt = salt;
                parent.Email = email;
                await _context.SaveChangesAsync();

                // Sync new registration with Admin / Serverless database asynchronously
                _ = SyncRegistrationWithServerAsync(email);
                return true;
            }

            parent = new ParentProfile
            {
                HashedPassword = hash,
                Salt = salt,
                Email = email
            };

            _context.ParentProfiles.Add(parent);
            await _context.SaveChangesAsync();

            // Sync new registration with Admin / Serverless database asynchronously
            _ = SyncRegistrationWithServerAsync(email);
            return true;
        }

        private static async Task SyncRegistrationWithServerAsync(string email)
        {
            try
            {
                var content = new StringContent(
                    JsonSerializer.Serialize(new { action = "register_sync", email = email }),
                    Encoding.UTF8,
                    "application/json"
                );
                // Try production URL and localhost
                await _httpClient.PostAsync("https://learnlock-rho.vercel.app/api/admin-control", content);
            }
            catch { }
        }

        public async Task<bool> VerifyParentPasswordAsync(string password)
        {
            var parent = await _context.ParentProfiles.FirstOrDefaultAsync();
            if (parent == null || string.IsNullOrWhiteSpace(parent.HashedPassword))
            {
                return false;
            }

            return PBKDF2Hasher.VerifyPassword(password, parent.HashedPassword, parent.Salt);
        }

        public async Task<List<ChildProfile>> GetChildrenAsync()
        {
            return await _context.ChildProfiles.ToListAsync();
        }

        public async Task<ChildProfile> CreateChildAsync(string name, DifficultyLevel difficulty, int dailyLimitSeconds, int schoolGrade, string blockedApps, int currentTimeBalanceSeconds = 0)
        {
            var child = new ChildProfile
            {
                Name = name,
                DifficultyLevel = difficulty,
                DailyLimitSeconds = dailyLimitSeconds,
                CurrentTimeBalanceSeconds = currentTimeBalanceSeconds,
                SchoolGrade = schoolGrade,
                BlockedApps = blockedApps
            };

            _context.ChildProfiles.Add(child);
            await _context.SaveChangesAsync();
            return child;
        }

        public async Task UpdateChildAsync(ChildProfile child)
        {
            var tracked = _context.ChildProfiles.Local.FirstOrDefault(c => c.Id == child.Id);
            if (tracked != null)
            {
                _context.Entry(tracked).CurrentValues.SetValues(child);
            }
            else
            {
                _context.Entry(child).State = EntityState.Modified;
            }
            await _context.SaveChangesAsync();
        }

        public async Task DeleteChildAsync(int childId)
        {
            var child = await _context.ChildProfiles.FindAsync(childId);
            if (child != null)
            {
                _context.ChildProfiles.Remove(child);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ParentProfile?> GetParentProfileAsync()
        {
            return await _context.ParentProfiles.FirstOrDefaultAsync();
        }

        public async Task UpdateParentProfileAsync(ParentProfile parent)
        {
            _context.Entry(parent).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteParentAccountAsync()
        {
            try
            {
                var parent = await _context.ParentProfiles.FirstOrDefaultAsync();
                if (parent != null)
                {
                    parent.HashedPassword = string.Empty;
                    parent.Salt = string.Empty;
                    parent.Email = string.Empty;
                    parent.Tier = SubscriptionTier.Free;
                    parent.SubscriptionExpiration = null;
                }

                var children = await _context.ChildProfiles.ToListAsync();
                _context.ChildProfiles.RemoveRange(children);

                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> ChangeParentPasswordAsync(string oldPassword, string newPassword)
        {
            var parent = await GetParentProfileAsync();
            if (parent == null)
            {
                return false;
            }

            bool isValid = PBKDF2Hasher.VerifyPassword(oldPassword, parent.HashedPassword, parent.Salt);
            if (!isValid)
            {
                return false;
            }

            var (hash, salt) = PBKDF2Hasher.HashPassword(newPassword);
            parent.HashedPassword = hash;
            parent.Salt = salt;

            _context.Entry(parent).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ResetParentPasswordAsync(string newPassword)
        {
            var parent = await GetParentProfileAsync();
            if (parent == null)
            {
                return false;
            }

            var (hash, salt) = PBKDF2Hasher.HashPassword(newPassword);
            parent.HashedPassword = hash;
            parent.Salt = salt;

            _context.Entry(parent).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SendPasswordResetCodeAsync(string email, string code)
        {
            try
            {
                using var client = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new System.Net.NetworkCredential("grizzlygoegym@gmail.com", "vflk txdb qdzp iukz".Replace(" ", "")),
                    EnableSsl = true
                };

                var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress("grizzlygoegym@gmail.com", "LearnLock Kindersicherung"),
                    Subject = "LearnLock - Passwort zurücksetzen",
                    Body = $"Hallo,\n\nSie haben eine Anfrage zum Zurücksetzen Ihres Eltern-Passworts gestellt.\n\nIhr Sicherheitscode lautet:\n\n{code}\n\nWenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.",
                    IsBodyHtml = false
                };
                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> SendOtpCodeAsync(string email, string code)
        {
            try
            {
                using var client = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new System.Net.NetworkCredential("grizzlygoegym@gmail.com", "vflk txdb qdzp iukz".Replace(" ", "")),
                    EnableSsl = true
                };

                var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress("grizzlygoegym@gmail.com", "LearnLock Kindersicherung"),
                    Subject = "Dein LearnLock Eltern-Code",
                    Body = $"Hallo,\n\ndein Verifizierungscode für den LearnLock Elternbereich lautet:\n\n{code}\n\nGib diesen Code in der App ein, um fortzufahren.",
                    IsBodyHtml = false
                };
                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
