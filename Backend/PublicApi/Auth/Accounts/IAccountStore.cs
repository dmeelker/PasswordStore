namespace PublicApi.Auth.Accounts
{
    public interface IAccountStore
    {
        UserAccount GetByName(string name);
    }
}