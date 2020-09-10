using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PublicApi.Accounts;
using PublicApi.Auth;
using System.Threading.Tasks;

namespace PublicApi
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            RegisterConfigurations(services);

            services.AddSingleton<IAccountStore, FileAccountStore>();
            services.AddSingleton<SessionStore>();
            services.AddSingleton<AuthService>();
            services.AddSingleton<AccountService>();

            services.AddHostedService<CleanupService>();
            
            services.AddControllers();
        }

        private void RegisterConfigurations(IServiceCollection services)
        {
            var accountStorageConfig = new AccountStorageConfig();
            Configuration.GetSection("AccountStorage").Bind(accountStorageConfig);
            services.AddSingleton(accountStorageConfig);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            InitializeServices(app).Wait();

            //app.UseHttpsRedirection();
            app.UseCors(builder =>
                builder.WithOrigins("*").AllowAnyHeader());
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }

        private async Task InitializeServices(IApplicationBuilder app)
        {
            var accountStore = app.ApplicationServices.GetRequiredService<IAccountStore>();
            if(accountStore is FileAccountStore)
            {
                await ((FileAccountStore)accountStore).ReadFile();
            }
        }
    }
}