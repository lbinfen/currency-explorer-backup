using MongoDB.Bson;

namespace repository
{
    public class TrxAction
    {
        public string act_digest { get; set; }

        public string trx_id { get; set; }

        public long block_num { get; set; }

        public string block_time { get; set; }

        public string account { get; set; }

        public string name { get; set; }

        public BsonValue data { get; set; } = (BsonValue)BsonNull.Value;

        public string data_hex { get; set; }

        public string status { get; set; }

        public bool data_error { get; set; }
    }
}