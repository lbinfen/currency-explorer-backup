using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Confluent.Kafka;
using Confluent.Kafka.Serialization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using repository;
using core.Services;
using Newtonsoft.Json;
using System.Threading;

namespace client
{
    class Program
    {
        static void Main(string[] args)
        {
            var loggerFactory = new LoggerFactory();
            loggerFactory.AddConsole();
            var logger = loggerFactory.CreateLogger("Eosio.KafkaClient");
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("appsettings.json");
            var configuration = configurationBuilder.Build();
            var settings = new KafkaClientSettings();
            configuration.GetSection(nameof(KafkaClientSettings)).Bind(settings);

            var conf = new Dictionary<string, object>
            {
                { "group.id", settings.ConsumerGroupId/*"eos-consumer-group"*/ },
                { "bootstrap.servers", settings.ConsumerBootstrapServers/*"192.168.1.234:9092"*/ },
                { "auto.commit.interval.ms", settings.ConsumerCommitInterval/*5000*/ },
                { "auto.offset.reset", settings.ConsumerOffsetReset/*"earliest"*/ }
            };
            var abiService = new ABIService(loggerFactory, settings.AbiBinToJsonUrl, settings.GetInfoUrl);
            IChainTrxRepository chainTrxRepository = new MongoChainTrxRepository(abiService, 
                settings.MongoClientConnectionString/*"mongodb://192.168.1.162:27017"*/, 
                settings.DatabaseName/*"EOSTEST"*/, 
                settings.TrxActionsCollectionName,
                settings.AppliedTransactionCollectionName,
                settings.AcceptTransactionCollectionName,
                settings.Actionfilters);
            Dictionary<string, Func<string, Task>> consumerActions = new Dictionary<string, Func<string, Task>>();
            consumerActions.Add(settings.ConsumerAcceptTopic, (Func<string, Task>)(msgValue => chainTrxRepository.SetAcceptTransactionAsync(msgValue)));
            consumerActions.Add(settings.ConsumerAppliedTopic, (Func<string, Task>)(msgValue => chainTrxRepository.SetAppliedTransactionAsync(msgValue)));

            string message = JsonConvert.SerializeObject((object)settings);
            logger.LogInformation(message);
            logger.LogInformation("Consumer start ...");
            Task.Run(() =>
            {
                Dictionary<string, Func<Task>> reSetFuncs = new Dictionary<string, Func<Task>>();
                reSetFuncs.Add(settings.ConsumerAcceptTopic, () => chainTrxRepository.ReSetAcceptTransactionsAsync());
                reSetFuncs.Add(settings.ConsumerAppliedTopic, () => chainTrxRepository.ReSetAppliedTransactionsAsync());
                while (true)
                {
                    try
                    {
                        reSetFuncs[settings.ConsumerSubscribeTopic]().Wait();
                    }
                    catch (Exception ex)
                    {
                        logger.LogError((EventId)0, ex, "ReSetError");
                    }
                    finally
                    {
                        Thread.Sleep(60000);
                    }
                }
            });
            using (Consumer<Null, string> consumer = new Consumer<Null, string>(conf, null, new StringDeserializer(Encoding.UTF8)))
            {
                consumer.OnMessage += (_, msg) =>
                {
                    consumerActions[settings.ConsumerSubscribeTopic](msg.Value).Wait();
                    logger.LogInformation(string.Format("Read '{0}-{1}' from: {2}", (object)msg.Topic, (object)msg.Timestamp.UtcDateTime.ToLongTimeString(), (object)msg.TopicPartitionOffset));
                };
                consumer.OnError += (_, error) => logger.LogInformation(string.Format("Error: {0}", (object)error));
                consumer.OnConsumeError += (_, msg) => logger.LogInformation(string.Format("Consume error ({0}): {1}", (object)msg.TopicPartitionOffset, (object)msg.Error));
                consumer.Subscribe(settings.ConsumerSubscribeTopic);
                while (true)
                    consumer.Poll(TimeSpan.FromMilliseconds(100.0));
            }
        }
    }
}
