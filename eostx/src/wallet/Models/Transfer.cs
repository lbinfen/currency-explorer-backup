using System;

namespace wallet.Models
{
  public class Transfer
  {
    public string Id { get; set; }

    public int blockNum { get; set; }

    public DateTime Time { get; set; }

    public string From { get; set; }

    public string To { get; set; }

    public string Quantity { get; set; }

    public string Memo { get; set; }

    public int Confirmations { get; set; }
  }
}