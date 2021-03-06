using System.Collections.Generic;
using System.Threading.Tasks;
using PublicApi.Utilities;

namespace PublicApi.Accounts
{
    public class MemoryAccountStore : IAccountStore
    {
        private readonly object _lock = new object();
        private readonly Dictionary<string, UserAccount> _accounts = new Dictionary<string, UserAccount>();
        //{
        //    {"Dennis", new UserAccount
        //    {
        //        Name = "Dennis",
        //        Password = "FMAxwcfsl0Lm0yKpOpE5bg/60dp5CwFoYwCklhozOaU=",
        //        PasswordSalt = "abcdef"
        //    }}
        //};

        public IEnumerable<UserAccount> AllAccounts => _accounts.Values;

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

        public Task<ActionResult<string>> UpdatePassword(string name, string newPassword)
        {
            lock (_lock)
            {
                if (!_accounts.TryGetValue(name, out var account))
                {
                    return Task.FromResult(ActionResult<string>.CreateError("Unknown account"));
                }

                account.Password = newPassword;

                return Task.FromResult(ActionResult<string>.CreateSuccess());
            }
        }
    }
}