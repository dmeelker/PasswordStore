using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace PublicApi.Auth
{
    public class CleanupService : IHostedService, IDisposable
    {
        private readonly ILogger<CleanupService> _logger;
        private readonly SessionStore _sessionStore;
        private Timer _timer;

        public CleanupService(ILogger<CleanupService> logger, SessionStore sessionStore)
        {
            _logger = logger;
            _sessionStore = sessionStore;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Starting {nameof(CleanupService)}");
            _timer = new Timer(DoWork, null, TimeSpan.Zero, 
                TimeSpan.FromMinutes(1));

            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            _sessionStore.RemoveExpiredSessions();
        }
        
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Stopping {nameof(CleanupService)}");
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}