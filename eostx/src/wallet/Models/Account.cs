using System;

namespace wallet.Models
{
    public class Account
    {
        public decimal Balance { get; set; }

        public DateTime Created { get; set; }

        public string[] Permissions { get; set; }

        public string Creator { get; set; }

    }
}