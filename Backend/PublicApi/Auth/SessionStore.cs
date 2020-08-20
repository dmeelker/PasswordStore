using System.Collections.Concurrent;
using System;

namespace PublicApi.Auth
{
    public class SessionStore
    {
        private readonly ConcurrentDictionary<string, UserSession> _sessions = new ConcurrentDictionary<string, UserSession>();

        public void Add(UserSession session)
        {
            _sessions.TryAdd(session.Token, session);
        }

        public bool TryGet(string token, out UserSession session)
        {
            return _sessions.TryGetValue(token, out session);
        }
    }
}
