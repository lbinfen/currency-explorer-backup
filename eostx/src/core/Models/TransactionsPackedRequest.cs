using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace core.Models
{
    public class TransactionsPackedRequest
    {
        [Required(ErrorMessage = "account is required.")]
        public string Account { get; set; }
        
        [Required(ErrorMessage = "name is required.")]
        public string Name { get; set; }
        
        [Required(ErrorMessage = "authorization is required.")]
        public ActionAuthorization[] Authorization { get; set; }

        public JObject Data;
    }

    public class ActionAuthorization
    {
        public string Actor { get; set; }

        public string Permission { get; set; }
    }
}