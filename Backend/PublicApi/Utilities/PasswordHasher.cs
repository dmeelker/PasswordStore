using System;
using System.Security.Cryptography;
using System.Text;

namespace PublicApi.Utilities
{
    public static class PasswordHasher
    {
        public static string Hash(string input, string salt)
        {
            return Hash(input + salt);
        }

        public static string Hash(string input)
        {
            using (var sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}
