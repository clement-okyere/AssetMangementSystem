using FluentValidation;
using FluentValidation.AspNetCore;
using Hahn.ApplicatonProcess.February2021.Data.CountryClient;
using Hahn.ApplicatonProcess.February2021.Data.Data;
using Hahn.ApplicatonProcess.February2021.Data.Repositories;
using Hahn.ApplicatonProcess.February2021.Data.UnitOfWork;
using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
using Hahn.ApplicatonProcess.February2021.Domain.Models;
using Hahn.ApplicatonProcess.February2021.Domain.Validators;
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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddDbContext<AssetContext>(opt => opt.UseInMemoryDatabase("Assets"));
            services.AddHttpClient<ICountryClient, CountryClient>(client =>
            {
                client.BaseAddress = new System.Uri("https://restcountries.eu/");
            });
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hahn.ApplicatonProcess.February2021.Web", Version = "v1" });
            });
            services.AddMvc().AddFluentValidation();
            services.AddTransient<IValidator<Asset>, AssetValidator>();
            services.AddTransient<IAssetRepository, AssetRepository>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hahn.ApplicatonProcess.February2021.Web v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
