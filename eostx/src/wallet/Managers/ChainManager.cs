using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using EosSharp;
using EosSharp.Core;
using EosSharp.Core.Api.v1;
using wallet.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace wallet.Managers
{
  public class ChainManager
  {
    private readonly EosConfigurator m_EosConfig;
    private readonly EosApi m_EosApi;
    private readonly HttpClient m_HttpClient;

    public ChainManager(EosConfigurator eosConfig)
    {
      m_EosConfig = eosConfig;
      m_EosApi = new EosApi(eosConfig, new HttpHandler());
      m_HttpClient = new HttpClient() { BaseAddress = new Uri(m_EosConfig.HttpEndpoint) };
      m_HttpClient.DefaultRequestHeaders.Connection.Add("keep-alive");
    }

    public async Task<PagedResult> GetBlocksAsync(BlocksRequest request)
    {
      var num = request.Num;
      if (!num.HasValue || num.Value == 0)
      {
        num = (await m_EosApi.GetInfo()).head_block_num;
      }
      var blocks = new List<Block>();
      long start = (long)num - (long)request.Skip - (long)request.Limit;
      long end = start + (long)request.Limit;
      if (start < 0)
      {
        start = 0;
      }
      for (var i = end; i > start; i--)
      {
        var block = await m_EosApi.GetBlock(new GetBlockRequest() { block_num_or_id = i.ToString() });
        blocks.Add(new Block
        {
          Id = block.id,
          Time = block.timestamp,
          Num = block.block_num,
          Producer = block.producer,
          Txns = block.transactions.Count
        });
      }
      return PagedResult.Create(blocks, (int)num.Value);
    }

    public async Task<PagedResult> GetTransfersAsync(TransfersRequest request)
    {
      var httpResponseMessage = await this.m_HttpClient.PostAsync("/v1/history/get_transfers", CreateStringContent(JsonConvert.SerializeObject((object)new
      {
        contract = "eosio.token",
        action = "transferex",
        skip = request.Skip,
        limit = request.Limit,
        Owner = request.Owner
      })));
      if (httpResponseMessage.IsSuccessStatusCode)
      {
        var contentStr = await httpResponseMessage.Content.ReadAsStringAsync();
        var response = JsonConvert.DeserializeObject<TransferResponse>(contentStr);
        var transfers = response.Actions.Select(a => new Transfer
        {
          Id = a.TrxId,
          blockNum = a.BlockNum,
          Time = a.BlockTime,
          From = a.Data.From,
          To = a.Data.To,
          Quantity = a.Data.Quantity,
          Memo = a.Data.Memo,
          Confirmations = (response.LastIrreversibleBlock > a.BlockNum) ? (response.LastIrreversibleBlock - a.BlockNum) : 0
        }).ToList();
        var result = PagedResult.Create(transfers, response.Total);
        return result;
      }
      return PagedResult.Empty<Transfer>();
    }

    public async Task<IEnumerable<wallet.Models.Producer>> GetProducersAsync(ProducersRequest request)
    {
      var currencyBalance = await m_EosApi.GetCurrencyBalance(new GetCurrencyBalanceRequest() { code = "eosio.token", account = "eosio.txfee", symbol = "VHKD" });
      decimal totalUnpaidTxfees = 0;
      if (currencyBalance.assets.Count > 0)
      {
        totalUnpaidTxfees = decimal.Parse(currencyBalance.assets[0].Split(' ')[0]);
      }
      var globalData = await m_EosApi.GetTableRows(new GetTableRowsRequest() { json = true, code = "eosio", scope = "eosio", table = "global" });
      var globalObject = (JObject)globalData.rows[0];
      var totalUnpaidTxfeeBlocks = (int)globalObject["total_unpaid_txfee_blocks"];
      var producers = await m_EosApi.GetProducers(new GetProducersRequest() { json = true, limit = request.Limit ?? 20 });

      return producers.rows.Cast<JObject>().Select(p => new wallet.Models.Producer()
      {
        Owner = p["owner"].ToString(),
        Localtion = "0",
        IsActive = "Active",
        UnpaidTxfee = Math.Round(totalUnpaidTxfees * (int)p["unpaid_txfee_blocks"] / totalUnpaidTxfeeBlocks, 4).ToString() + " VHKD"
      }).ToList();
    }

    public async Task<wallet.Models.Account> GetAccountAsync(AccountRequest request)
    {
      var currencyBalanceInfo = await m_EosApi.GetCurrencyBalance(new GetCurrencyBalanceRequest()
      {
        code = "eosio.token",
        account = request.Name,
        symbol = "VHKD"
      });
      decimal currencyBalance = 0;
      if (currencyBalanceInfo.assets.Count > 0)
      {
        currencyBalance = decimal.Parse(currencyBalanceInfo.assets[0].Split(' ')[0]);
      }
      Account result = null;
      try
      {
        var account = await m_EosApi.GetAccount(new GetAccountRequest { account_name = request.Name });
        result = new Account()
        {
          Balance = currencyBalance,
          Created = account.created,
          Permissions = account.permissions.SelectMany(p => p.required_auth.keys.Select(k => k.key)).Distinct().ToArray()
        };
      }
      catch { }
      return result;
    }

    public async Task<GetBlockResponse> GetBlockAsync(BlockRequest request)
    {
      try
      {
        var block = await m_EosApi.GetBlock(new GetBlockRequest() { block_num_or_id = request.BlockNumOrId });
        return block;
      }
      catch
      {
        return null;
      }
    }

    public async Task<JObject> GetTxAsync(TxRequest request)
    {
      var httpResponseMessage = await this.m_HttpClient.PostAsync("/v1/history/get_transaction", CreateStringContent(JsonConvert.SerializeObject((object)new
      {
        id = request.Id
      })));
      if (httpResponseMessage.IsSuccessStatusCode)
      {
        var contentStr = await httpResponseMessage.Content.ReadAsStringAsync();
        var response = JsonConvert.DeserializeObject<JObject>(contentStr);
        response.Remove("_id");
        var lastIrreversibleBlock = (int)response["last_irreversible_block"];
        var block_num = (int)response["block_num"];
        response.Add("confirmations", lastIrreversibleBlock - block_num > 0 ? (lastIrreversibleBlock - block_num) : 0);
        return response;
      }
      return null;
    }

    public async Task<GetKeyAccountsResponse> GetKeyAsync(KeyRequest request)
    {
      try
      {
        var keyAccounts = await m_EosApi.GetKeyAccounts(new GetKeyAccountsRequest { public_key = request.PublicKey });
        return keyAccounts;
      }
      catch
      {
        return null;
      }
    }

    private static HttpContent CreateStringContent(string jsonContent)
    {
      return (HttpContent)new StringContent(jsonContent, Encoding.UTF8, "application/json");
    }
  }
}