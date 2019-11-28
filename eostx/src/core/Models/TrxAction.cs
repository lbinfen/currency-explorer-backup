using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace core.Models
{
    [BsonIgnoreExtraElements]
    public class TrxAction
    {
        [BsonId]
        [JsonProperty("id")]
        [BsonElement("_id")]
        public ObjectId Id { get; set; }

        [JsonProperty("trx_id")]
        [BsonElement("trx_id")]
        public string TrxId { get; set; }

        [JsonProperty("block_num")]
        [BsonElement("block_num")]
        public long BlockNum { get; set; }

        [JsonProperty("block_time")]
        [BsonElement("block_time")]
        public string BlockTime { get; set; }

        [BsonElement("account")]
        public string Account { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("data")]
        public object Data { get; set; }
    }
}