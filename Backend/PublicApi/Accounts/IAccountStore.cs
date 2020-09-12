using System.Threading.Tasks;
using PublicApi.Utilities;

namespace PublicApi.Accounts
{
    public interface IAccountStore
    {
        Task<UserAccount> GetByName(string name);
        Task CreateAccount(UserAccount newAccount);
        Task<ActionResult<string>> UpdatePassword(string name, string newPassword);
    }
}