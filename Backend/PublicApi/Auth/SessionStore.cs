using System.Collections.Concurrent;
using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace PublicApi.Auth
{
    public class SessionStore
    {
        private readonly ILogger<SessionStore> _logger;
        private readonly ConcurrentDictionary<string, UserSession> _sessionsByToken = new ConcurrentDictionary<string, UserSession>();

        public SessionStore(ILogger<SessionStore> logger)
        {
            _logger = logger;
        }

        public void Add(UserSession session)
        {
            // var client = new MongoClient("mongodb://localhost:27017");
            // var database = client.GetDatabase("authentication");
            // var collection = database.GetCollection<UserSession>("sessions");
            // collection.InsertOne(session);
            
            _sessionsByToken.TryAdd(session.Token, session);
        }

        public bool TryGet(string token, out UserSession session)
        {
            return _sessionsByToken.TryGetValue(token, out session);
        }

        public bool TryRefresh(string originalToken, UserSession session)
        {
            if (!_sessionsByToken.TryRemove(originalToken, out _))
            {
                throw new Exception($"Unable to remove token to store");
            }

            if (!_sessionsByToken.TryAdd(session.Token, session))
            {
                throw new Exception($"Unable to add token to store");
            }

            return true;
        }
        
        public void RemoveExpiredSessions()
        {
            _logger.LogDebug("Performing token cleanup");
            
            foreach (var session in _sessionsByToken.Values.ToArray())
            {
                if (session.IsRefreshTokenExpired)
                {
                    _logger.LogInformation("Removing expired token {Token}", session.Token);
                    _sessionsByToken.TryRemove(session.Token, out _);
                }
            }
        }
    }
}
