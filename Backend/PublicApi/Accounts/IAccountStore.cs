using System.Threading.Tasks;

namespace PublicApi.Accounts
{
    public interface IAccountStore
    {
        Task<UserAccount> GetByName(string name);
        Task CreateAccount(UserAccount newAccount);
    }
}