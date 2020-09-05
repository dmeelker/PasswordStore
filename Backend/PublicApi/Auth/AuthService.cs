using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace PublicApi.Auth
{
    public class AuthService
    {
        private readonly ILogger<AuthService> _logger;
        private SessionStore _sessionStore;

        public AuthService(ILogger<AuthService> logger, SessionStore sessionStore)
        {
            _logger = logger;
            _sessionStore = sessionStore;
        }

        public bool VerifyCredentials(string user, string password)
        {
            return (user == "Dennis" && password == "pass") || (user == "Dennis2" && password == "pass");
        }

        public UserSession BeginSession(string user)
        {
            var session = new UserSession(user);

            _sessionStore.Add(session);

            return session;
        }

        public bool VerifyToken(string token, out UserSession session)
        {
            var tokenExists = _sessionStore.TryGet(token, out session);
            return tokenExists && !session.IsTokenExpired;
        }
        
        public bool Refresh(string token, string refreshToken, out UserSession sessionOut)
        {
            if (_sessionStore.TryGet(token, out var session))
            {
                if (!session.IsRefreshTokenExpired)
                {
                    if (refreshToken == session.RefreshToken)
                    {
                        _logger.LogInformation("Refreshing session {SessionId} with refresh token {RefreshToken}", session.Id, session.RefreshToken);
                        var originalToken = session.Token;
                        
                        session.Refresh();
                        if (_sessionStore.TryRefresh(originalToken, session))
                        {
                            sessionOut = session;
                            return true;
                        }
                        else
                        {
                            sessionOut = null;
                            return false;
                        }
                    }
                }
            }

            sessionOut = null;
            return false;
        }
    }
}
