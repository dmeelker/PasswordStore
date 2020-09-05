using System.Collections.Generic;

namespace PublicApi.Auth.Accounts
{
    public class MemoryAccountStore : IAccountStore
    {
        private readonly Dictionary<string, UserAccount> _accounts = new Dictionary<string, UserAccount>()
        {
            {"Dennis", new UserAccount
            {
                Name = "Dennis",
                Password = "pass"
            }}
        }; 
        
        public UserAccount GetByName(string name)
        {
            if (_accounts.ContainsKey(name))
                return _accounts[name];
            else
                return null;
        }
    }
}