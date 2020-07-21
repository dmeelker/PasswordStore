using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serilog;

namespace PublicApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public byte[] Get(string username, string passwordHash)
        {
            return new byte[0];
        }

        [HttpPost]
        public void Put(string username, string passwordHash, byte[] data)
        {
            _logger.LogInformation("Updating repository for user {username}", username);
        }
    }
}