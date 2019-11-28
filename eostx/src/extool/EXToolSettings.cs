namespace extool
{
    public class EXToolSettings
    {
        public string MongoClientConnectionString { get; set; } = "mongodb://192.168.1.162:27017";

        public string DatabaseName { get; set; } = "EOSTEST";

        public string AppliedTransactionCollectionName { get; set; } = "eos_applied_topic";

        public string AcceptTransactionCollectionName { get; set; } = "eos_accept_topic";

        public string TrxActionsCollectionName { get; set; } = "eos_trx_actions";

        public string Actionfilters { get; set; } = "*:transfer,*:issue,*:create,*:retire,*:close";

        public string AbiBinToJsonUrl { get; set; }

        public string GetInfoUrl { get; set; }

        public string GetTransactionUrl { get; set; }
    }
}