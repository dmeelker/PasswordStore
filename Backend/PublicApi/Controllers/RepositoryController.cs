using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PublicApi.Repository;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using System.Text;
using System.IO;
using System.Linq;
using PublicApi.Auth;
using System.Net;

namespace PublicApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RepositoryController : ControllerBase
    {
        private readonly ILogger<RepositoryController> _logger;
        private readonly DocumentRepository _repository = new DocumentRepository();
        private readonly AuthService _authService;

        public RepositoryController(ILogger<RepositoryController> logger, AuthService authService)
        {
            _logger = logger;
            _authService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var header = HttpContext.Request.Headers["auth-token"].FirstOrDefault();
            if(!_authService.VerifyToken(header, out var session))
            {
                return new StatusCodeResult((int)HttpStatusCode.Forbidden);
            }

            var document = await _repository.Get(session.User);

            return document != null ? Ok(document) : (IActionResult)NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Put()
        {
            var header = HttpContext.Request.Headers["auth-token"].FirstOrDefault();
            if (!_authService.VerifyToken(header, out var session))
            {
                return new StatusCodeResult((int)HttpStatusCode.Forbidden);
            }

            var text = await new StreamReader(Request.Body).ReadToEndAsync();
            _logger.LogInformation("Updating repository for user {username}", session.User);
            await _repository.Save(session.User, Encoding.UTF8.GetBytes(text));
            return Ok();
        }
    }
}
