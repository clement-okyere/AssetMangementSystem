using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureLogging((hostingContext, logging) =>
                {
                    logging.AddFilter("Microsoft", LogLevel.Information)
                    .AddFilter("System", LogLevel.Error);

                    // Configure serilog pipelines
                    Log.Logger = new LoggerConfiguration()
                                    .MinimumLevel.Debug()
                                    .Enrich.FromLogContext()
                                    .ReadFrom.Configuration(hostingContext.Configuration)
                                    .CreateLogger();

                    logging
                            .AddConfiguration(hostingContext.Configuration.GetSection("Logging"));

                });
    }
}
