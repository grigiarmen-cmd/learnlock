using System;
using System.Security.Cryptography;

namespace LearnLock.Auth
{
    public static class PBKDF2Hasher
    {
        private const int SaltSize = 16;
        private const int KeySize = 32;
        private const int Iterations = 10000;

        public static (string Hash, string Salt) HashPassword(string password)
        {
            byte[] saltBytes = RandomNumberGenerator.GetBytes(SaltSize);
            byte[] hashBytes = Rfc2898DeriveBytes.Pbkdf2(
                password,
                saltBytes,
                Iterations,
                HashAlgorithmName.SHA256,
                KeySize);

            return (Convert.ToBase64String(hashBytes), Convert.ToBase64String(saltBytes));
        }

        public static bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            try
            {
                byte[] saltBytes = Convert.FromBase64String(storedSalt);
                byte[] hashBytes = Convert.FromBase64String(storedHash);

                byte[] computeBytes = Rfc2898DeriveBytes.Pbkdf2(
                    password,
                    saltBytes,
                    Iterations,
                    HashAlgorithmName.SHA256,
                    KeySize);

                return CryptographicOperations.FixedTimeEquals(hashBytes, computeBytes);
            }
            catch
            {
                return false;
            }
        }
    }
}
