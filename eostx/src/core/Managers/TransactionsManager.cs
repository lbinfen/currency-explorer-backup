using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Bson;
using Newtonsoft.Json.Linq;
using core.Models;
using core.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EosSharp.Core;
using EosSharp;
using EosSharp.Core.Api.v1;
using EosSharp.Core.Providers;
using EosSharp.Core.Helpers;

namespace core.Managers
{
    public static class JObjectExtensions
    {
        public static IDictionary<string, object> ToDictionary(this JObject @object)
        {
            var result = @object.ToObject<Dictionary<string, object>>();

            var JObjectKeys = (from r in result
                               let key = r.Key
                               let value = r.Value
                               where value.GetType() == typeof(JObject)
                               select key).ToList();

            var JArrayKeys = (from r in result
                              let key = r.Key
                              let value = r.Value
                              where value.GetType() == typeof(JArray)
                              select key).ToList();

            JArrayKeys.ForEach(key => result[key] = ((JArray)result[key]).Select(x =>
            {
                if (x is JValue)
                {
                    return ((JValue)x).Value;
                }
                else if (x is JProperty)
                {
                    return ((JValue)((JProperty)x).Value).Value;
                }
                else if (x is JObject)
                {
                    return ToDictionary(x as JObject);
                }
                else
                {
                    return x.ToString();
                }
            }).ToArray());
            JObjectKeys.ForEach(key => result[key] = ToDictionary(result[key] as JObject));

            return result;
        }
    }

    public class TransactionsManager
    {
        private readonly string m_TransactionCollectionName = "eos_applied_topic";
        private readonly string m_TransferCollectionName = "eos_trx_actions";
        private readonly EosConfigurator m_EosConfig;
        private readonly EosApi m_EosApi;
        private readonly core.Services.AbiSerializationProvider m_AbiSerializer;
        private readonly ABIService m_ABIService;
        private readonly IMongoClient m_MongoClient;
        private readonly IMongoDatabase m_MongoDatabase;

        public TransactionsManager(
          EosConfigurator eosConfig,
          ABIService abiService,
          string connectionString,
          string databaseName,
          string transactionCollectionName,
          string transferCollectionName)
        {
            this.m_EosConfig = eosConfig;
            this.m_ABIService = abiService;
            this.m_MongoClient = (IMongoClient)new MongoClient(connectionString);
            this.m_MongoDatabase = this.m_MongoClient.GetDatabase(databaseName, (MongoDatabaseSettings)null);
            this.m_TransactionCollectionName = transactionCollectionName;
            this.m_TransferCollectionName = transferCollectionName;
            this.m_EosApi = new EosApi(this.m_EosConfig, new HttpHandler());
            this.m_AbiSerializer = new core.Services.AbiSerializationProvider(this.m_EosApi);
        }

        public async Task<string> GetAccountCreatorAsync(string name)
        {
            if(string.IsNullOrEmpty(name))
                return string.Empty;

            var andSource = new Dictionary<string, string>();
            andSource.Add("status", "executed");
            andSource.Add("account", "eosio");
            andSource.Add("name", "newaccount");
            andSource.Add("data.name", name);

            var collection = this.m_MongoDatabase.GetCollection<TrxAction>(this.m_TransferCollectionName);
            var builderFilter = Builders<TrxAction>.Filter;
            var allFilters = builderFilter.And(andSource.Select(f => builderFilter.Eq<string>(f.Key, f.Value)));
            var actions = await collection.Find<TrxAction>(allFilters).Sort(Builders<TrxAction>.Sort.Descending("block_num")).Limit(1).ToListAsync();
            if (actions.Count > 0)
            {
                var action = actions[0];
                var creator = (JObject.FromObject(action.Data))["creator"].ToString();
                return creator;
            }
            return string.Empty;
        }

        public async Task<TransfersGetResponse> GetTransfersAsync(
          TransfersGetRequest request)
        {
            int? limit = request.Limit;
            if (!limit.HasValue)
            {
                request.Limit = new int?(10);
            }
            else
            {
                limit = request.Limit;
                if (limit.Value > 1000)
                    request.Limit = new int?(1000);
            }
            Dictionary<string, string> andSource = new Dictionary<string, string>();
            Dictionary<string, string> orSource = new Dictionary<string, string>();

            andSource.Add("status", "executed");

            if (!string.IsNullOrEmpty(request.Contract))
                andSource.Add("account", request.Contract);
            
            if (!string.IsNullOrEmpty(request.Action))
                andSource.Add("name", request.Action);

            if (!string.IsNullOrEmpty(request.Owner))
            {
                switch (request.Type)
                {
                    case TransferType.All:
                        orSource.Add("data.from", request.Owner);
                        orSource.Add("data.to", request.Owner);
                        break;
                    case TransferType.Send:
                        andSource.Add("data.from", request.Owner);
                        break;
                    case TransferType.Receive:
                        andSource.Add("data.to", request.Owner);
                        break;
                    default:
                        break;
                }
            }

            if (!string.IsNullOrEmpty(request.TrxId))
                andSource.Add("trx_id", request.TrxId);

            IMongoCollection<TrxAction> collection = this.m_MongoDatabase.GetCollection<TrxAction>(this.m_TransferCollectionName, (MongoCollectionSettings)null);
            FilterDefinitionBuilder<TrxAction> builderFilter = Builders<TrxAction>.Filter;
            List<TrxAction> actions;
            long total;
            if (andSource.Count == 0 && orSource.Count == 0)
            {
                actions = await collection.Find<TrxAction>(builderFilter.Empty, (FindOptions)null).Sort(Builders<TrxAction>.Sort.Descending((FieldDefinition<TrxAction>)"_id")).Skip(request.Skip).Limit(request.Limit).ToListAsync<TrxAction>(new CancellationToken());
                total = await collection.CountDocumentsAsync(builderFilter.Empty, (CountOptions)null, new CancellationToken());
            }
            else
            {
                FilterDefinition<TrxAction> allFilters = null;

                if (andSource.Count > 0 && orSource.Count > 0)
                {
                    FilterDefinition<TrxAction> orFilters = builderFilter.Or(orSource.Select(f => builderFilter.Eq<string>(f.Key, f.Value)));
                    FilterDefinition<TrxAction> andFilters = builderFilter.And(andSource.Select(f => builderFilter.Eq<string>(f.Key, f.Value)));
                    allFilters = builderFilter.And(new[] { andFilters, orFilters });
                }
                else if (andSource.Count > 0)
                {
                    allFilters = builderFilter.And(andSource.Select(f => builderFilter.Eq<string>(f.Key, f.Value)));
                }
                else
                {
                    allFilters = builderFilter.Or(orSource.Select(f => builderFilter.Eq<string>(f.Key, f.Value)));
                }

                actions = await collection.Find<TrxAction>(allFilters, (FindOptions)null).Sort(Builders<TrxAction>.Sort.Descending((FieldDefinition<TrxAction>)"block_num")).Skip(request.Skip).Limit(request.Limit).ToListAsync<TrxAction>(new CancellationToken());
                total = await collection.CountDocumentsAsync(allFilters, (CountOptions)null, new CancellationToken());
            }
            long irreversibleBlockNumAsync = await this.m_ABIService.GetLastIrreversibleBlockNumAsync();
            return new TransfersGetResponse()
            {
                Actions = (IEnumerable<TrxAction>)actions,
                Total = total,
                LastIrreversibleBlock = irreversibleBlockNumAsync
            };
        }

        public async Task<JObject> GetTransactionAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id));
            JObject obj = (await this.m_MongoDatabase.GetCollection<BsonDocument>(this.m_TransactionCollectionName, (MongoCollectionSettings)null).Find<BsonDocument>((FilterDefinition<BsonDocument>)new BsonDocument(nameof(id), (BsonValue)id), (FindOptions)null).ToListAsync<BsonDocument>(new CancellationToken())).Select<BsonDocument, JObject>(new Func<BsonDocument, JObject>(TransactionsManager.ToJObject)).FirstOrDefault<JObject>();
            if (obj == null)
                return null;
            await this.ActionFilterInclude(obj);
            var lastIrreversibleBlockNum = await this.m_ABIService.GetLastIrreversibleBlockNumAsync();
            obj["last_irreversible_block"] = lastIrreversibleBlockNum;
            return obj;
        }

        public async Task<string> CreatePackedTransaction(TransactionsPackedRequest request)
        {
            var action = new EosSharp.Core.Api.v1.Action
            {
                account = request.Account,
                authorization = request.Authorization?.Select(p => new PermissionLevel() { actor = p.Actor, permission = p.Permission }).ToList(),
                name = request.Name,
                data = request.Data
            };
            if (action.data != null && action.data is JObject)
            {
                action.data = ((JObject)action.data).ToDictionary();
            }
            if (string.IsNullOrEmpty(action.account))
                throw new ArgumentNullException(nameof(request.Account));

            if (string.IsNullOrEmpty(action.name))
                throw new ArgumentNullException(nameof(request.Name));

            if (action.authorization == null || action.authorization.Count == 0)
                throw new ArgumentNullException(nameof(request.Authorization));

            var trx = new Transaction()
            {
                actions = new List<EosSharp.Core.Api.v1.Action>()
                {
                    action
                }
            };

            GetInfoResponse getInfoResult = null;
            string chainId = m_EosConfig.ChainId;

            if (string.IsNullOrWhiteSpace(chainId))
            {
                getInfoResult = await m_EosApi.GetInfo();
                chainId = getInfoResult.chain_id;
            }

            if (trx.expiration == DateTime.MinValue ||
               trx.ref_block_num == 0 ||
               trx.ref_block_prefix == 0)
            {
                if (getInfoResult == null)
                    getInfoResult = await m_EosApi.GetInfo();

                var getBlockResult = await m_EosApi.GetBlock(new GetBlockRequest()
                {
                    block_num_or_id = getInfoResult.last_irreversible_block_num.ToString()
                });

                trx.expiration = getInfoResult.head_block_time.AddSeconds(m_EosConfig.ExpireSeconds);
                trx.ref_block_num = (UInt16)(getInfoResult.last_irreversible_block_num & 0xFFFF);
                trx.ref_block_prefix = getBlockResult.ref_block_prefix;
            }

            var packedTrx = await m_AbiSerializer.SerializePackedTransaction(trx);
            return SerializationHelper.ByteArrayToHexString(packedTrx);
        }

        private async Task ActionFilterInclude(JObject doc)
        {
            if (doc == null)
                return;

            JToken jtoken1 = (JToken)null;
            JToken jtoken2;
            if (doc.TryGetValue("action_traces", out jtoken2))
            {
                jtoken1 = jtoken2;
            }
            else
            {
                JToken jtoken3;
                if (doc.TryGetValue("inline_traces", out jtoken3))
                    jtoken1 = jtoken3;
            }
            if (jtoken1 == null)
                return;
            using (IEnumerator<JToken> enumerator = ((IEnumerable<JToken>)jtoken1).GetEnumerator())
            {
                while (((IEnumerator)enumerator).MoveNext())
                {
                    JObject actionDoc = (JObject)enumerator.Current;
                    JToken act = actionDoc.GetValue("act");
                    string abiParsed = await this.m_ABIService.ParseAsync(act.Value<string>("account"), act.Value<string>("name"), act.Value<string>("data"));
                    if (!string.IsNullOrEmpty(abiParsed))
                    {
                        act["data_hex"] = act["data"];
                        act["data"] = JToken.Parse(abiParsed)["args"];
                    }
                    await this.ActionFilterInclude(actionDoc);
                    actionDoc = (JObject)null;
                    act = (JToken)null;
                }
            }
        }

        private static IEnumerable<JObject> ToJObjects(IEnumerable<BsonDocument> bsons)
        {
            return (IEnumerable<JObject>)bsons.Select<BsonDocument, JObject>(new Func<BsonDocument, JObject>(TransactionsManager.ToJObject)).ToList<JObject>();
        }

        private static JObject ToJObject(BsonDocument bson)
        {
            return JObject.Parse(TransactionsManager.ToJson(bson));
        }

        private static HttpContent CreateStringContent(string jsonContent)
        {
            return (HttpContent)new StringContent(jsonContent, Encoding.UTF8, "application/json");
        }

        private static string ToJson(BsonDocument bson)
        {
            using (var stream = new MemoryStream())
            {
                using (var writer = new BsonBinaryWriter(stream))
                {
                    BsonSerializer.Serialize(writer, typeof(BsonDocument), bson);
                }
                stream.Seek(0, SeekOrigin.Begin);
                using (var reader = new Newtonsoft.Json.Bson.BsonDataReader(stream))
                {
                    var sb = new StringBuilder();
                    var sw = new StringWriter(sb);
                    using (var jWriter = new JsonTextWriter(sw))
                    {
                        jWriter.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                        jWriter.WriteToken(reader);
                    }
                    return sb.ToString();
                }
            }
        }
    }
}