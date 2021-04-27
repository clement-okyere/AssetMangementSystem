using FluentValidation;
using FluentValidation.AspNetCore;
using Hahn.ApplicatonProcess.February2021.Data.CountryClient;
using Hahn.ApplicatonProcess.February2021.Data.Data;
using Hahn.ApplicatonProcess.February2021.Data.Repositories;
using Hahn.ApplicatonProcess.February2021.Data.UnitOfWork;
using Hahn.ApplicatonProcess.February2021.Data.ValidationFilters;
using Hahn.ApplicatonProcess.February2021.Data.Validator;
using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
using Hahn.ApplicatonProcess.February2021.Domain.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Web
{
    public class Startup
    {
        protected const string CorsPolicyName = "CorsPolicyName";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        //This method gets called by the runtime.Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AssetContext>(opt => opt.UseInMemoryDatabase("Assets"));
            services.AddHttpClient<ICountryClient, CountryClient>(client =>
            {
                client.BaseAddress = new System.Uri("https://restcountries.eu/");
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hahn.ApplicatonProcess.February2021.Web", Version = "v1" });
            });

            //services.AddCors();

            services.AddTransient<IAssetRepository, AssetRepository>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddControllers(options =>
            {
                options.Filters.Add(typeof(ValidateModelAttribute));
            })
            .AddFluentValidation(s =>
            {
                s.RegisterValidatorsFromAssemblyContaining<AssetValidator>();
                s.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "web/dist";
            });
        }

        //This method gets called by the runtime.Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hahn.ApplicatonProcess.February2021.Web v1"));
            }

            loggerFactory.AddSerilog();
                
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            // global cors policy
            //app.UseCors(x => x
            //    .AllowAnyMethod()
            //    .AllowAnyHeader()
            //    .SetIsOriginAllowed(origin => true) // allow any origin
            //    .AllowCredentials()); // allow credentials

           
            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "web";

                // In Development env, ClientApp is served by Webpack Dev server
                // In Production env, ClientApp is served using minified and bundled code from 'web/dist'
                if (env.IsDevelopment())
                {

                    // Aurelia Webpack Dev Server
                    spa.UseProxyToSpaDevelopmentServer(baseUri: "http://localhost:8080");
                }
            });
        }
    }
}
