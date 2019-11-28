namespace wallet.Models
{
    public class TransfersRequest
    {
        public int? Skip { get; set; } = 0;

        public int? Limit { get; set; } = 20;

        public string Owner { get; set; }
    }
}