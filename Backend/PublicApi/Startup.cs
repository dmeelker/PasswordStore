using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PublicApi.Accounts;
using PublicApi.Auth;

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
            var accountStore = new FileAccountStore(new System.IO.FileInfo("accounts.json"));
            accountStore.ReadFile().Wait();

            services.AddSingleton<IAccountStore>(accountStore);
            services.AddSingleton<SessionStore>();
            services.AddSingleton<AuthService>();
            services.AddSingleton<AccountService>();

            services.AddHostedService<CleanupService>();
            
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            
            
            //app.UseHttpsRedirection();
            app.UseCors(builder =>
                builder.WithOrigins("*").AllowAnyHeader());
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}