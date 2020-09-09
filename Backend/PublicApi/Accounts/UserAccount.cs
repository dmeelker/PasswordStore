namespace PublicApi.Accounts
{
    public class UserAccount
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
    }
}