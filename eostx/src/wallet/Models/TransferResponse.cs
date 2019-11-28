using System;
using Newtonsoft.Json;

namespace wallet.Models
{
    public class TransferResponse
    {
        [JsonProperty("total")]
        public int Total { get; set; }

        [JsonProperty("last_irreversible_block")]
        public int LastIrreversibleBlock { get; set; }

        [JsonProperty("actions")]
        public TrasferAction[] Actions { get; set; }
    }

    public class TrasferAction
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("trx_id")]
        public string TrxId { get; set; }

        [JsonProperty("block_num")]
        public int BlockNum { get; set; }

        [JsonProperty("block_time")]
        public DateTime BlockTime { get; set; }

        [JsonProperty("account")]
        public string Account { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("data")]
        public TransferActionData Data { get; set; }
    }

    public class TransferActionData
    {
        [JsonProperty("from")]
        public string From { get; set; }

        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("quantity")]
        public string Quantity { get; set; }

        [JsonProperty("fee")]
        public string Fee { get; set; }

        [JsonProperty("memo")]
        public string Memo { get; set; }
    }
}