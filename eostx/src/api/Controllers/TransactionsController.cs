using core.Managers;
using core.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System;

namespace api.Controllers
{
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionsManager m_TransactionsManager;

        public TransactionsController(TransactionsManager transactionsManager)
        {
            this.m_TransactionsManager = transactionsManager;
        }

        [HttpPost("v1/history/get_transaction")]
        public async Task<IActionResult> Get(TransactionsGetRequest request)
        {
            var transaction = await this.m_TransactionsManager.GetTransactionAsync(request.Id);
            if (transaction == null)
                return NotFound();

            return Ok(transaction);
        }

        [HttpPost("v1/service/pack_transaction")]
        public async Task<IActionResult> Get(TransactionsPackedRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = String.Join(',', ModelState.Values.SelectMany(c => c.Errors).Select(e => e.ErrorMessage));
                return BadRequest(errors);
            }
            try
            {
                var packedTrx = await this.m_TransactionsManager.CreatePackedTransaction(request);
                return Ok(packedTrx);
            }
            catch (EosSharp.Core.Exceptions.ApiErrorException e)
            {
                return BadRequest(e.error.details[0].message);
            }
            catch (System.ArgumentException e)
            {
                return BadRequest(e.Message);
            }
            catch (System.Exception e)
            {
                throw e;
            }
        }
    }
}