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
    public class RepositoryController : BaseController
    {
        private readonly ILogger<RepositoryController> _logger;
        private readonly DocumentRepository _repository = new DocumentRepository();
        private readonly AuthService _authService;

        public RepositoryController(ILogger<RepositoryController> logger, AuthService authService) : base(authService)
        {
            _logger = logger;
            _authService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            if(!UserAuthenticated())
            {
                return Forbidden();
            }

            var document = await _repository.Get(Session.User);

            return document != null ? Ok(document) : (IActionResult)NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Put()
        {
            if(!UserAuthenticated())
            {
                return Forbidden();
            }

            var text = await new StreamReader(Request.Body).ReadToEndAsync();
            _logger.LogInformation("Updating repository for user {username}", Session.User);
            await _repository.Save(Session.User, Encoding.UTF8.GetBytes(text));
            return Ok();
        }
    }
}
