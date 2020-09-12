using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Auth;

namespace PublicApi.Controllers
{
    public class BaseController : ControllerBase
    {
        private readonly AuthService _authService;

        public BaseController(AuthService authService)
        {
            _authService = authService;
        }

        protected bool UserAuthenticated()
        {
            return Session != null;
        }

        protected UserSession Session 
        {
            get
            {
                if (!HttpContext.Items.ContainsKey("session"))
                {
                    var header = HttpContext.Request.Headers["auth-token"].FirstOrDefault();
                    if (_authService.VerifyToken(header, out var session))
                    {
                        HttpContext.Items["session"] = session;
                    }
                    else
                    {
                        HttpContext.Items["session"] = null;
                    }
                }
                
                return HttpContext.Items["session"] as UserSession;
            }
        }

        protected IActionResult Forbidden() => new StatusCodeResult((int)HttpStatusCode.Forbidden);
    }
}