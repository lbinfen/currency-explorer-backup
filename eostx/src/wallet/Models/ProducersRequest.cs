namespace wallet.Models
{
    public class ProducersRequest
    {
        public int? Skip { get; set; } = 0;

        public int? Limit { get; set; } = 20;
    }
}