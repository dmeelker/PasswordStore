using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using PublicApi.Utilities;

namespace PublicApi.Accounts
{
    public class FileAccountStore : IAccountStore
    {
        private readonly ILogger<FileAccountStore> _logger;
        private readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);
        private readonly FileInfo _file;
        private readonly MemoryAccountStore _memoryStore = new MemoryAccountStore();

        public FileAccountStore(ILogger<FileAccountStore> logger, AccountStorageConfig configuration)
        {
            _logger = logger;
            _file = new FileInfo(configuration.File);
        }

        public async Task CreateAccount(UserAccount newAccount)
        {
            await _lock.WaitAsync();

            try
            {
                await _memoryStore.CreateAccount(newAccount);
                _ = Task.Run(async () =>
                  {
                      await WriteFile();
                  });
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<ActionResult<string>> UpdatePassword(string name, string newPassword)
        {
            await _lock.WaitAsync();

            try
            {
                var result = await _memoryStore.UpdatePassword(name, newPassword);
                _ = Task.Run(async () =>
                {
                    await WriteFile();
                });
                return result;
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
                _logger.LogInformation("No account file found");
                return;
            }

            _logger.LogInformation("Loading account file {FileName}", _file.FullName);

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

            _logger.LogInformation("Loaded {AccountCount} accounts", accountFile.Accounts.Length);
        }

        private async Task WriteFile()
        {
            await _lock.WaitAsync();

            try
            {
                _logger.LogInformation("Writing accounts file");
                var accountFile = new AccountFile {
                    Accounts = _memoryStore.AllAccounts.Select(account => new AccountEntry {
                        AccountName = account.Name,
                        PasswordHash = account.Password,
                        PasswordSalt = account.PasswordSalt
                    }).ToArray()
                };
                var content = JsonSerializer.Serialize(accountFile);

                await File.WriteAllTextAsync(_file.FullName, content);
                _logger.LogInformation("Successfully wrote {AccountCount} accounts to file", accountFile.Accounts.Length);
            }
            finally
            {
                _lock.Release();
            }
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
