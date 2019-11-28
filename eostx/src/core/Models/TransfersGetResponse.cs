using Newtonsoft.Json;
using System.Collections.Generic;

namespace core.Models
{
    public class TransfersGetResponse
    {
        public IEnumerable<TrxAction> Actions { get; set; }

        [JsonProperty("last_irreversible_block")]
        public long LastIrreversibleBlock { get; set; }

        public long Total { get; set; }
    }
}