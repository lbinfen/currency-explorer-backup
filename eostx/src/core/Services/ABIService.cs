using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace core.Services
{
    public class ABIService
    {
        private readonly Uri m_AbiBinToJsonUrl;
        private readonly Uri m_GetInfoUrl;
        private readonly HttpClient m_HttpClient;
        private readonly ILogger m_Logger;

        public ABIService(ILoggerFactory loggerFactory, string abiBinToJsonUrl, string getInfoUrl)
        {
            this.m_Logger = loggerFactory.CreateLogger("TrxRepository");
            this.m_AbiBinToJsonUrl = new Uri(abiBinToJsonUrl);
            this.m_GetInfoUrl = new Uri(getInfoUrl);
            this.m_HttpClient = new HttpClient();
            this.m_HttpClient.DefaultRequestHeaders.Connection.Add("keep-alive");
        }

        public async Task<long> GetLastIrreversibleBlockNumAsync()
        {
            HttpResponseMessage getResult = await this.m_HttpClient.GetAsync(this.m_GetInfoUrl);
            var getContent = await getResult.Content.ReadAsStringAsync();
            if (getResult.IsSuccessStatusCode)
            {
                return JObject.Parse(getContent).GetValue("last_irreversible_block_num").Value<long>();
            }
            this.m_Logger.LogError((EventId)0, getContent);
            return 0;
        }

        public async Task<string> ParseAsync(string account, string name, string data_hex)
        {
            if (string.IsNullOrEmpty(data_hex))
                return (string)null;
            HttpResponseMessage httpResponseMessage = await this.m_HttpClient.PostAsync(this.m_AbiBinToJsonUrl, ABIService.CreateStringContent(JsonConvert.SerializeObject((object)new
            {
                code = account,
                action = name,
                binargs = data_hex
            })));
            if (httpResponseMessage.IsSuccessStatusCode)
                return await httpResponseMessage.Content.ReadAsStringAsync();
            if (name == "transfer" && account != "eosio.token")
                return await this.ParseAsync("eosio.token", "transfer", data_hex);
            this.m_Logger.LogError((EventId)0, await httpResponseMessage.Content.ReadAsStringAsync());
            return (string)null;
        }

        public static HttpContent CreateStringContent(string jsonContent)
        {
            return (HttpContent)new StringContent(jsonContent, Encoding.UTF8, "application/json");
        }
    }
}