namespace wallet.Models
{
    public class BlocksRequest
    {
        public uint? Skip { get; set; } = 0;

        public uint? Limit { get; set; } = 10;

        public uint? Num { get; set; }
    }
}