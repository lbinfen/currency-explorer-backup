using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core.Managers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using wallet.Managers;
using wallet.Models;

namespace wallet.Controllers
{
    [Route("api/[controller]")]
    public class ChainController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };
        private readonly ChainManager m_ChainManager;
        private readonly TransactionsManager m_TransactionsManager;

        public ChainController(ChainManager chainManager, TransactionsManager transactionsManager)
        {
            m_ChainManager = chainManager;
            m_TransactionsManager = transactionsManager;
        }

        [HttpGet("Blocks")]
        public Task<PagedResult> Blocks([FromQuery]BlocksRequest request)
        {
            var blocks = m_ChainManager.GetBlocksAsync(request);
            return blocks;
        }

        [HttpGet("Transfers")]
        public Task<PagedResult> Transfers([FromQuery]TransfersRequest request)
        {
            var transfers = m_ChainManager.GetTransfersAsync(request);
            return transfers;
        }

        [HttpGet("Producers")]
        public Task<IEnumerable<Producer>> Producers([FromQuery]ProducersRequest request)
        {
            var producers = m_ChainManager.GetProducersAsync(request);
            return producers;
        }

        [HttpPost("Account")]
        public async Task<IActionResult> Account([FromBody]AccountRequest request)
        {
            var account = await m_ChainManager.GetAccountAsync(request);
            if (account == null)
                return NotFound("account not found");

            var creator = await m_TransactionsManager.GetAccountCreatorAsync(request.Name);
            account.Creator = creator;
            return Json(account);
        }

        [HttpPost("Block")]
        public async Task<IActionResult> Block([FromBody]BlockRequest request)
        {
            var block = await m_ChainManager.GetBlockAsync(request);
            if (block == null)
                return NotFound("block not found");

            return Json(block);
        }

        [HttpPost("Tx")]
        public async Task<IActionResult> Tx([FromBody]TxRequest request)
        {
            var tx = await m_ChainManager.GetTxAsync(request);
            if (tx == null)
                return NotFound("tx not found");

            return Json(tx);
        }

        [HttpPost("Key")]
        public async Task<IActionResult> Key([FromBody]KeyRequest request)
        {
            var key = await m_ChainManager.GetKeyAsync(request);
            if (key == null)
                return NotFound("key not found");

            return Json(key);
        }

        [NonAction]
        private NotFoundObjectResult NotFound(string message)
        {
            return base.NotFound(new { code = 404, message = message });
        }
    }
}
