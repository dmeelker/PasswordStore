using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Accounts;
using PublicApi.Auth;

namespace PublicApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : BaseController
    {
        private readonly AccountService _accountService;

        public AccountController(AuthService authService, AccountService accountService) : base(authService)
        {
            _accountService = accountService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterPost data)
        {
            var result = await _accountService.CreateAccount(new NewAccount { 
                AccountName = data.AccountName,
                Password = data.Password
            });

            if (result.Success)
            {
                return Ok("Account created");
            }
            else
            { ;
                return BadRequest(result.Error);
            }
        }

        [HttpPost]
        [Route("changepassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordPost data)
        {
            if (!UserAuthenticated())
            {
                return Forbidden();
            }

            var result = await _accountService.ChangePassword(Session.User, data.NewPassword);

            if (result.Success)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Error);
            }
        }
    }

    public class RegisterPost 
    { 
        public string AccountName { get; set; }
        public string Password { get; set; }
    }

    public class ChangePasswordPost
    {
        public string NewPassword { get; set; }
    }
}
