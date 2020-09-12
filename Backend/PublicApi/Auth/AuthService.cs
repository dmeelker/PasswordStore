using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PublicApi.Accounts;
using PublicApi.Utilities;

namespace PublicApi.Auth
{
    public class AuthService
    {
        private readonly ILogger<AuthService> _logger;
        private AccountService _accountService;
        private SessionStore _sessionStore;

        public AuthService(ILogger<AuthService> logger, AccountService accountService, SessionStore sessionStore)
        {
            _logger = logger;
            _accountService = accountService;
            _sessionStore = sessionStore;
        }

        public async Task<bool> VerifyCredentials(string user, string password)
        {
            var account = await _accountService.GetAccountByName(user);
            if (account == null)
                return false;

            var suppliedPasswordHash = PasswordHasher.Hash(password, account.PasswordSalt);
            return account.Password == suppliedPasswordHash;
        }

        public UserSession BeginSession(string user)
        {
            var session = new UserSession(user);

            _sessionStore.Add(session);

            return session;
        }

        public void CloseSession(string token)
        {
            if(_sessionStore.TryGet(token, out var session))
            {
                _logger.LogInformation("Closing session {SessionId}", session.Id);
                _sessionStore.Remove(token);
            }
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
