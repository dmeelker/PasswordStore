using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Auth;

namespace PublicApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public IActionResult Login(LoginPost data)
        {
            if(_authService.VerifyCredentials(data.User, data.Password))
            {
                var session = _authService.BeginSession(data.User);
                return Ok(new TokenResponse() { 
                    Token = session.Token
                });
            } 
            else
            {
                return new StatusCodeResult((int) System.Net.HttpStatusCode.Forbidden);
            }
        }
    }

    public class LoginPost
    {
        public string User { get; set; }
        public string Password { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; }
    }
}
