using System;

namespace PublicApi.Auth
{
    public class UserSession
    {
        public string Token { get; }
        public string User { get; }

        public UserSession(string token, string user)
        {
            Token = token;
            User = user;
        }
    }
}
