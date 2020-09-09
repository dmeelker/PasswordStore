using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace PublicApi.Accounts
{
    public class FileAccountStore : IAccountStore
    {
        private readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);
        private readonly FileInfo _file;
        private readonly MemoryAccountStore _memoryStore = new MemoryAccountStore();

        public FileAccountStore(FileInfo file)
        {
            _file = file;
        }

        public async Task CreateAccount(UserAccount newAccount)
        {
            await _lock.WaitAsync();

            try
            {
                await _memoryStore.CreateAccount(newAccount);
                await WriteFile();
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<UserAccount> GetByName(string name)
        {
            return await _memoryStore.GetByName(name);
        }

        public async Task ReadFile()
        {
            if (!_file.Exists)
            {
                return;
            }

            var content = File.ReadAllText(_file.FullName);
            var accountFile = JsonSerializer.Deserialize<AccountFile>(content);

            foreach(var account in accountFile.Accounts)
            {
                await _memoryStore.CreateAccount(new UserAccount { 
                    Name = account.AccountName,
                    Password = account.PasswordHash,
                    PasswordSalt = account.PasswordSalt
                });
            }
        }

        private async Task WriteFile()
        {
            var accountFile = new AccountFile {
                Accounts = _memoryStore.AllAccounts.Select(account => new AccountEntry {
                    AccountName = account.Name,
                    PasswordHash = account.Password,
                    PasswordSalt = account.PasswordSalt
                }).ToArray()
            };
            var content = JsonSerializer.Serialize(accountFile);

            await File.WriteAllTextAsync(_file.FullName, content);
        }

        class AccountFile
        {
            public AccountEntry[] Accounts { get; set; } = new AccountEntry[0];
        }

        class AccountEntry
        {
            public string AccountName { get; set; }
            public string PasswordHash { get; set; }
            public string PasswordSalt { get; set; }
        }
    }
}
