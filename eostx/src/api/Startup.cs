using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core.Managers;
using core.Services;
using EosSharp.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace api
{
    public class Startup
    {
        private readonly ILoggerFactory m_LoggerFactory;

        public Startup(IConfiguration configuration, ILoggerFactory loggerFactory)
        {
            this.Configuration = configuration;
            this.m_LoggerFactory = loggerFactory;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            services.UseTransactionsManager(this.Configuration, this.m_LoggerFactory);

            MvcCoreMvcBuilderExtensions.SetCompatibilityVersion(MvcServiceCollectionExtensions.AddMvc(services), (CompatibilityVersion)1);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (HostingEnvironmentExtensions.IsDevelopment(env))
                DeveloperExceptionPageExtensions.UseDeveloperExceptionPage(app);
            else
                HstsBuilderExtensions.UseHsts(app);
            MvcApplicationBuilderExtensions.UseMvc(app);
        }
    }
}
