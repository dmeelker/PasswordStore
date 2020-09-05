using System;

namespace PublicApi.Auth
{
    public class UserSession
    {
        public string Id { get; }
        public DateTimeOffset CreationTime { get; }
        public DateTimeOffset LastRefreshTime { get; private set; }
        public string Token { get; private set; }
        public string RefreshToken { get; private set; }
        public string User { get; }
        public DateTimeOffset RefreshTokenExpirationTime => LastRefreshTime + TimeSpan.FromMinutes(2);
        public DateTimeOffset TokenExpirationTime => LastRefreshTime + TimeSpan.FromMinutes(1);
        public bool IsTokenExpired => DateTimeOffset.Now > TokenExpirationTime;
        public bool IsRefreshTokenExpired => DateTimeOffset.Now > RefreshTokenExpirationTime;
        
        public UserSession(string user)
        {
            Id = Guid.NewGuid().ToString();
            CreationTime = DateTimeOffset.Now;
            User = user;
            Refresh();
        }

        public void Refresh()
        {
            LastRefreshTime = DateTimeOffset.Now;
            Token = Guid.NewGuid().ToString();
            RefreshToken = Guid.NewGuid().ToString();
        }
    }
}
