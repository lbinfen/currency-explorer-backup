using System;

namespace wallet.Models
{
    public class Block
    {
        public string Id { get; set; }

        public uint Num { get; set; }

        public DateTime Time { get; set; }

        public string Producer { get; set; }

        public int Txns { get; set; }
    }
}