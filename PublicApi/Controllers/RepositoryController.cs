using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PublicApi.Repository;
using System.Threading.Tasks;

namespace PublicApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RepositoryController : ControllerBase
    {
        private readonly ILogger<RepositoryController> _logger;
        private readonly DocumentRepository _repository = new DocumentRepository();

        public RepositoryController(ILogger<RepositoryController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<byte[]> Get(string username)
        {
            return await _repository.Get(username);
        }

        [HttpPost]
        public async Task Put(string username, byte[] data)
        {
            _logger.LogInformation("Updating repository for user {username}", username);
            await _repository.Save(username, data);
        }
    }
}
/*

{
    "Format": "1.0",
    "Entries": [ 
        {
            "Type": "Group",
            "Name": "Banking",
            "Icon": "Folder",
            "Children": [
                {
                    "Type": "Password",
                    "Name": "SuperBank2000",
                    "Password": "qwerty",
                }
            ]
        }

    ]
}

 */