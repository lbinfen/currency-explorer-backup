using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace repository
{
    public interface IChainTrxRepository
    {
        Task<JObject> GetAppliedTransactionAsync(string id);

        Task SetAppliedTransactionAsync(string data);
        

        Task ReSetAppliedTransactionsAsync();

        Task<JObject> GetAcceptTransactionAsync(string id);

        Task SetAcceptTransactionAsync(string data);

        Task ReSetAcceptTransactionsAsync();

        Task<IEnumerable<JObject>> GetTransactionsByBlockNumsAsync(params long[] blockNums);

        Task<IEnumerable<JObject>> GetTransactionsByBlockNumAsync(long num);
    }
}