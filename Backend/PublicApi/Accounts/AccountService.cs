using Microsoft.Extensions.Logging;
using PublicApi.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicApi.Accounts
{
    public class NewAccount
    {
        public string AccountName { get; set; }
        public string Password { get; set; }
    }

    public class AccountService
    {
        private readonly ILogger<AccountService> _logger;
        private readonly IAccountStore _accountStore;

        public AccountService(ILogger<AccountService> logger, IAccountStore accountStore)
        {
            _logger = logger;
            _accountStore = accountStore;
        }

        public async Task<UserAccount> GetAccountByName(string accountName)
        {
            return await _accountStore.GetByName(accountName);
        }

        public async Task<ActionResult<string[]>> CreateAccount(NewAccount newAccount)
        {
            _logger.LogInformation("Creating account {AccountName}", newAccount.AccountName);

            var verifyResult = await VerifyNewAccount(newAccount);
            if (!verifyResult.Success)
            {
                return verifyResult;
            }

            var salt = Guid.NewGuid().ToString();

            await _accountStore.CreateAccount(new UserAccount
            {
                Name = newAccount.AccountName,
                Password = PasswordHasher.Hash(newAccount.Password, salt),
                PasswordSalt = salt
            });

            _logger.LogInformation("Account created: {AccountName}", newAccount.AccountName);
            return ActionResult<string[]>.CreateSuccess();
        }

        private async Task<ActionResult<string[]>> VerifyNewAccount(NewAccount newAccount)
        {
            var errors = new List<string>();
            Check(string.IsNullOrWhiteSpace(newAccount.AccountName), "Empty account name is not allowed");
            Check(newAccount.Password.Length == 0, "Empty password is not allowed");
            Check(await AccountNameIsUsed(newAccount.AccountName), "Account name has already been used");

            if (errors.Any())
            {
                return ActionResult<string[]>.CreateError(errors.ToArray());
            }
            else
            {
                return ActionResult<string[]>.CreateSuccess();
            }

            void Check(bool check, string error)
            {
                if (check)
                {
                    errors.Add(error);
                }
            }
        }

        public async Task<ActionResult<string>> ChangePassword(string accountName, string newPassword)
        {
            _logger.LogInformation("Changing password for account {AccountName}", accountName);
            var account = await _accountStore.GetByName(accountName);
            if (account == null)
            {
                return ActionResult<string>.CreateError("Account does not exist");
            }
            
            var passwordHash = PasswordHasher.Hash(newPassword, account.PasswordSalt);
            
            return await _accountStore.UpdatePassword(accountName, passwordHash);
        }
        
        private async Task<bool> AccountNameIsUsed(string accountName)
        {
            return await _accountStore.GetByName(accountName) != null;
        }
    }
}
