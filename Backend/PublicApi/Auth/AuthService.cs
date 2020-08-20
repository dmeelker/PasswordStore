using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicApi.Auth
{
    public class AuthService
    {
        private SessionStore _sessionStore;

        public AuthService(SessionStore sessionStore)
        {
            _sessionStore = sessionStore;
        }

        public bool VerifyCredentials(string user, string password)
        {
            return user == "Dennis" && password == "pass";
        }

        public UserSession BeginSession(string user)
        {
            var session = new UserSession(Guid.NewGuid().ToString(), user);

            _sessionStore.Add(session);

            return session;
        }

        public bool VerifyToken(string token, out UserSession session)
        {
            return _sessionStore.TryGet(token, out session);
        }
    }
}
