namespace core.Models
{
    public class TransfersGetRequest
    {
        public string Contract { get; set; }

        public string Action { get; set; }

        public TransferType Type { get; set; }

        public string Owner { get; set; }

        public string TrxId { get; set; }

        public int? Skip { get; set; }

        public int? Limit { get; set; }
    }

    public enum TransferType : byte
    {
        All = 0,

        Send = 1,

        Receive = 2
    }
}