using core.Managers;
using core.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace api.Controllers
{
    [ApiController]
    public class TransfersController : ControllerBase
    {
        private readonly TransactionsManager m_TransactionsManager;

        public TransfersController(TransactionsManager transactionsManager)
        {
            this.m_TransactionsManager = transactionsManager;
        }

        [HttpPost("v1/history/get_transfers")]
        public Task<TransfersGetResponse> Get(TransfersGetRequest request)
        {
            return this.m_TransactionsManager.GetTransfersAsync(request);
        }
    }
}