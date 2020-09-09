using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Accounts;

namespace PublicApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly AccountService _accountService;

        public RegisterController(AccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost]
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
}
