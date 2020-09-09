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
        [Route("login")]
        public async Task<IActionResult> Login(LoginPost data)
        {
            if(await _authService.VerifyCredentials(data.User, data.Password))
            {
                var session = _authService.BeginSession(data.User);
                return Ok(new TokenResponse() { 
                    Token = session.Token,
                    RefreshToken = session.RefreshToken,
                    ExpirationTime = session.TokenExpirationTime.UtcDateTime
                });
            } 
            else
            {
                return new StatusCodeResult((int) System.Net.HttpStatusCode.Forbidden);
            }
        }
        
        [HttpPost]
        [Route("refresh")]
        public IActionResult Refresh(RefreshPost data)
        {
            if(_authService.Refresh(data.Token, data.RefreshToken, out var session))
            {
                return Ok(new TokenResponse() { 
                    Token = session.Token,
                    RefreshToken = session.RefreshToken,
                    ExpirationTime = session.TokenExpirationTime.UtcDateTime
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
    
    public class RefreshPost
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime ExpirationTime { get; set; }
    }
}
