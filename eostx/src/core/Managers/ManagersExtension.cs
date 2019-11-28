using System;
using core.Services;
using EosSharp.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace core.Managers
{
    public static class ManagersExtension
    {
        public static IServiceCollection UseTransactionsManager(this IServiceCollection services, IConfiguration Configuration, ILoggerFactory loggerFactory)
        {
            string eosNodeUrl = Configuration.GetValue<string>("EosNodeUrl", "");
            var abiService = new ABIService(loggerFactory, eosNodeUrl + "/v1/chain/abi_bin_to_json", eosNodeUrl + "/v1/chain/get_info");
            string connectionString = Configuration.GetValue<string>("MongoClientConnectionString", "");
            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentNullException("mongoClientConnectionString is required");
            string databaseName = Configuration.GetValue<string>("MongoClientDatabaseName", "");
            string transactionCollectionName = Configuration.GetValue<string>("MongoClientTransactionsName", "");
            string transferCollectionName = Configuration.GetValue<string>("MongoClientTransfersName", "");
            var eosConfig = new EosConfigurator()
            {
                HttpEndpoint = eosNodeUrl,
                ExpireSeconds = 60
            };
            AbiSerializationProvider.Prefix = "VHKD";
            TransactionsManager implementationInstance = new TransactionsManager(eosConfig, abiService, connectionString, databaseName, transactionCollectionName, transferCollectionName);
            services.AddSingleton<TransactionsManager>(implementationInstance);
            return services;
        }
    }
}