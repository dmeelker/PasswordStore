using System.Collections.Generic;
using System.Threading.Tasks;

namespace PublicApi.Accounts
{
    public class MemoryAccountStore : IAccountStore
    {
        private readonly object _lock = new object();
        private readonly Dictionary<string, UserAccount> _accounts = new Dictionary<string, UserAccount>()
        {
            {"Dennis", new UserAccount
            {
                Name = "Dennis",
                Password = "FMAxwcfsl0Lm0yKpOpE5bg/60dp5CwFoYwCklhozOaU=",
                PasswordSalt = "abcdef"
            }}
        };

        public async Task<UserAccount> GetByName(string name)
        {
            lock (_lock)
            {
                if (_accounts.ContainsKey(name))
                    return _accounts[name];
                else
                    return null;
            }
        }

        public async Task CreateAccount(UserAccount newAccount)
        {
            lock (_lock)
            {
                if (_accounts.ContainsKey(newAccount.Name))
                {
                    throw new System.Exception($"An account with name {newAccount.Name} already exists");
                }

                _accounts.Add(newAccount.Name, newAccount);
            }
        }
    }
}