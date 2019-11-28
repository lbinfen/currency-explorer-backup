using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using repository;
using core.Services;
using Newtonsoft.Json;
using System.Threading;
using System.Net.Http;

namespace extool
{
    class Program
    {
        static void Main(string[] args)
        {
            args = new[] { "61f57e03b30dd494c83272f1c19c6481d9e1593a138bff3e84e82ac6018bfe7f" };
            var loggerFactory = new LoggerFactory();
            loggerFactory.AddConsole();
            var logger = loggerFactory.CreateLogger("extool");
            if (args == null || args.Length == 0)
            {
                logger.LogInformation("please input block number");
                return;
            }
            var trxId = args[0].Trim();
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("appsettings.json");
            var configuration = configurationBuilder.Build();
            var settings = new EXToolSettings();
            configuration.GetSection(nameof(EXToolSettings)).Bind(settings);

            var abiService = new ABIService(loggerFactory, settings.AbiBinToJsonUrl, settings.GetInfoUrl);
            IChainTrxRepository chainTrxRepository = new MongoChainTrxRepository(abiService,
                settings.MongoClientConnectionString/*"mongodb://192.168.1.162:27017"*/,
                settings.DatabaseName/*"EOSTEST"*/,
                settings.TrxActionsCollectionName,
                settings.AppliedTransactionCollectionName,
                settings.AcceptTransactionCollectionName,
                settings.Actionfilters);

            string message = JsonConvert.SerializeObject((object)settings);
            logger.LogInformation(message);
            logger.LogInformation("extool start ...");

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Connection.Add("keep-alive");
                var httpResponseMessage = httpClient.PostAsync(settings.GetTransactionUrl,
                    ABIService.CreateStringContent(JsonConvert.SerializeObject((object)new
                    {
                        id = trxId
                    }))).Result;
                var responseString = httpResponseMessage.Content.ReadAsStringAsync().Result;
                logger.LogInformation(responseString);
                if (httpResponseMessage.IsSuccessStatusCode)
                {
                    chainTrxRepository.SetAppliedTransactionAsync(responseString).Wait();
                }
            }
        }
    }
}
