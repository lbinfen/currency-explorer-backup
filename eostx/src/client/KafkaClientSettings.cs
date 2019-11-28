namespace client
{
    public class KafkaClientSettings
    {
        public string ConsumerGroupId { get; set; } = "eos-consumer-group";

        public string ConsumerBootstrapServers { get; set; } = "192.168.1.234:9092";

        public int ConsumerCommitInterval { get; set; } = 5000;

        public string ConsumerOffsetReset { get; set; } = "earliest";

        public string ConsumerSubscribeTopic { get; set; }

        public string ConsumerAppliedTopic { get; set; } = "eos_applied_topic";
        
        public string ConsumerAcceptTopic { get; set; } = "eos_accept_topic";

        public string MongoClientConnectionString { get; set; } = "mongodb://192.168.1.162:27017";

        public string DatabaseName { get; set; } = "EOSTEST";

        public string AppliedTransactionCollectionName { get; set; } = "eos_applied_topic";

        public string AcceptTransactionCollectionName { get; set; } = "eos_accept_topic";

        public string TrxActionsCollectionName { get; set; } = "eos_trx_actions";

        public string Actionfilters { get; set; } = "*:transfer,*:issue,*:create,*:retire,*:close";

        public string AbiBinToJsonUrl { get; set; }

        public string GetInfoUrl { get; set; }
    }
}