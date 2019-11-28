using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.Services;

namespace repository
{
    public class MongoChainTrxRepository : IChainTrxRepository
    {
        private readonly ActionFilter[] m_ActionFilters = new ActionFilter[0];
        private readonly string m_TrxActionsCollectionName = "eos_trx_actions";
        private readonly string m_AppliedTransactionCollectionName = "eos_applied_topic";
        private readonly string m_AcceptTransactionCollectionName = "eos_accept_topic";
        private readonly UpdateOptions m_UpdateOptions = new UpdateOptions()
        {
            IsUpsert = true
        };

        private readonly ABIService m_ABIService;
        private readonly IMongoClient m_MongoClient;
        private readonly IMongoDatabase m_Database;

        public MongoChainTrxRepository(ABIService abiService,
            string connectionString,
            string databaseName,
            string trxActionsCollectionName,
            string appliedTransactionCollectionName,
            string acceptTransactionCollectionName,
            string actionFilters)
        {
            m_ABIService = abiService;
            m_MongoClient = new MongoClient(connectionString);
            m_Database = m_MongoClient.GetDatabase(databaseName);
            m_TrxActionsCollectionName = trxActionsCollectionName;
            m_AppliedTransactionCollectionName = appliedTransactionCollectionName;
            m_AcceptTransactionCollectionName = acceptTransactionCollectionName;
            m_ActionFilters = actionFilters.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(m => m.Split(new char[] { ':' }, StringSplitOptions.None))
                .Where(m => m.Length == 2).Select(m => new ActionFilter()
                {
                    Account = m[0],
                    Name = m[1]
                }).ToArray<ActionFilter>();
        }

        public async Task<JObject> GetAppliedTransactionAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id));

            var collection = m_Database.GetCollection<BsonDocument>(m_AppliedTransactionCollectionName);
            var list = await collection.Find(new BsonDocument("trace.id", id)).ToListAsync();
            return list.Select(ToJObject).FirstOrDefault();
        }

        public async Task SetAppliedTransactionAsync(string json)
        {
            var doc = BsonDocument.Parse(json);
            var trxActionList = new List<TrxAction>();
            this.ActionFilterInclude(doc, (IList<TrxAction>)trxActionList);
            if (trxActionList.Count == 0)
                return;
            string status = "none";
            MongoDB.Bson.BsonValue statusValue;
            if (doc.TryGetValue("receipt", out statusValue) ||
                (doc.TryGetValue("trx", out BsonValue trxValue) && trxValue.AsBsonDocument.TryGetValue("receipt", out statusValue)))
            {
                status = statusValue.AsBsonDocument.GetValue("status").AsString;
            }
            var builder = Builders<TrxAction>.Filter;
            var trxActionCollections = this.m_Database.GetCollection<TrxAction>(this.m_TrxActionsCollectionName);
            foreach (TrxAction trxAction in trxActionList)
            {
                TrxAction ta = trxAction;
                ta.status = status;
                bool has_hex = !string.IsNullOrEmpty(ta.data_hex);
                if (has_hex)
                {
                    string async = await this.m_ABIService.ParseAsync(ta.account, ta.name, ta.data_hex);
                    if (!string.IsNullOrEmpty(async))
                    {
                        ta.data = BsonDocument.Parse(async).GetValue("args");
                    }
                }
                ta.data_error = has_hex && ta.data == (MongoDB.Bson.BsonValue)BsonNull.Value;
                await trxActionCollections.ReplaceOneAsync(builder.Eq<string>("act_digest", ta.act_digest), ta, this.m_UpdateOptions);
                ta = (TrxAction)null;
            }
            await this.m_Database.GetCollection<BsonDocument>(this.m_AppliedTransactionCollectionName)
                .ReplaceOneAsync(new BsonDocument("id", doc.GetValue("id").AsString), doc, this.m_UpdateOptions);
        }

        public async Task ReSetAppliedTransactionsAsync()
        {
            var collection = this.m_Database.GetCollection<BsonDocument>(this.m_TrxActionsCollectionName);
            using (var cursor = await collection.FindAsync<BsonDocument>(new BsonDocument("data_error", true)))
            {
                while (true)
                {
                    if (await cursor.MoveNextAsync())
                    {
                        foreach (BsonDocument bsonDocument in cursor.Current)
                        {
                            BsonDocument document = bsonDocument;
                            MongoDB.Bson.BsonValue _id = document.GetValue("_id");
                            string account = document.GetValue("account").AsString;
                            string name = document.GetValue("name").AsString;
                            string data_hex = document.GetValue("data_hex").AsString;
                            bool has_hex = !string.IsNullOrEmpty(data_hex);
                            MongoDB.Bson.BsonValue data = (MongoDB.Bson.BsonValue)null;
                            if (has_hex)
                            {
                                string parsedData = await this.m_ABIService.ParseAsync(account, name, data_hex);
                                if (!string.IsNullOrEmpty(parsedData))
                                {
                                    data = BsonDocument.Parse(parsedData).GetValue("args");
                                }
                            }
                            bool flag = has_hex && data == (MongoDB.Bson.BsonValue)BsonNull.Value;
                            if (!flag)
                            {
                                document["data"] = data;
                                document["data_error"] = (MongoDB.Bson.BsonValue)flag;
                                await collection.ReplaceOneAsync(new BsonDocument("_id", _id), document, this.m_UpdateOptions);
                            }
                            _id = (MongoDB.Bson.BsonValue)null;
                            data = (MongoDB.Bson.BsonValue)null;
                            document = (BsonDocument)null;
                        }
                    }
                    else
                        break;
                }
            }
        }

        public Task<JObject> GetAcceptTransactionAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task SetAcceptTransactionAsync(string json)
        {
            throw new NotImplementedException();
        }

        public Task ReSetAcceptTransactionsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<JObject>> GetTransactionsByBlockNumsAsync(params long[] blockNums)
        {
            if (blockNums == null)
                throw new ArgumentNullException(nameof(blockNums));
            if (blockNums.Length == 1)
            {
                var transactions = await GetTransactionsByBlockNumAsync(blockNums[0]);
                return transactions;
            }

            var collection = m_Database.GetCollection<BsonDocument>(m_AppliedTransactionCollectionName);
            var builder = new FilterDefinitionBuilder<BsonDocument>();
            var filter = builder.In("block_number", blockNums);
            var list = await collection.Find(filter).ToListAsync();
            return ToJObjects(list);
        }

        public async Task<IEnumerable<JObject>> GetTransactionsByBlockNumAsync(long num)
        {
            if (num == 0)
                return Enumerable.Empty<JObject>();

            var collection = m_Database.GetCollection<BsonDocument>(m_AppliedTransactionCollectionName);
            var list = await collection.Find(new BsonDocument("block_number", num)).ToListAsync();
            return ToJObjects(list);
        }

        private void ActionFilterInclude(BsonDocument doc, IList<TrxAction> trxActions)
        {
            if (this.m_ActionFilters.Length == 0)
                return;

            MongoDB.Bson.BsonArray bsonArray = null;
            MongoDB.Bson.BsonValue bsonValue;

            if (doc.TryGetValue("action_traces", out bsonValue) || doc.TryGetValue("traces", out bsonValue) || doc.TryGetValue("inline_traces", out bsonValue))
            {
                bsonArray = bsonValue.AsBsonArray;
            }

            if (bsonArray == null)
                return;

            foreach (MongoDB.Bson.BsonValue bsonItem in bsonArray)
            {
                BsonSerializationArgs args = new BsonSerializationArgs();
                BsonDocument bsonDocument = bsonItem.ToBsonDocument<MongoDB.Bson.BsonValue>((IBsonSerializer<MongoDB.Bson.BsonValue>)null, (Action<BsonSerializationContext.Builder>)null, args);
                BsonDocument asBsonDocument = bsonDocument.GetValue("act").AsBsonDocument;
                string account = asBsonDocument.GetValue("account").AsString;
                string name = asBsonDocument.GetValue("name").AsString;
                if (this.m_ActionFilters.Any(af =>
                {
                    if (!(af.Account == "*") && !(af.Account == account))
                        return false;
                    if (!(af.Name == "*"))
                        return af.Name == name;
                    return true;
                }))
                    this.AddToTrxActions(trxActions, bsonDocument);
                this.ActionFilterInclude(bsonDocument, trxActions);
            }
        }

        private void AddToTrxActions(IList<TrxAction> trxActions, BsonDocument actionDoc)
        {
            string act_digest = actionDoc.GetValue("block_num").AsInt32.ToString() + "-" + 
                actionDoc.GetValue("receipt").AsBsonDocument.GetValue("act_digest").AsString;

            BsonDocument asBsonDocument = actionDoc.GetValue("act").AsBsonDocument;
            string account = asBsonDocument.GetValue("account").AsString;
            string name = asBsonDocument.GetValue("name").AsString;
            string data_hex = string.Empty;
            MongoDB.Bson.BsonValue data = MongoDB.Bson.BsonNull.Value;
            BsonValue dataValue;
            BsonValue hexDataValue;
            if (asBsonDocument.TryGetValue("hex_data", out hexDataValue) && asBsonDocument.TryGetValue("data", out dataValue))
            {
                data = dataValue;
                data_hex = hexDataValue.AsString;
            }
            else if (asBsonDocument.TryGetValue("hex_data", out hexDataValue))
            {
                data_hex = hexDataValue.AsString;
            }
            else if (asBsonDocument.TryGetValue("data", out dataValue))
            {
                data_hex = dataValue.AsString;
            }
            string trx_id = actionDoc.GetValue("trx_id").AsString;
            int block_num = actionDoc.GetValue("block_num").AsInt32;
            string block_time = actionDoc.GetValue("block_time").AsString;
            TrxAction trxAction = new TrxAction()
            {
                act_digest = act_digest,
                trx_id = trx_id,
                block_num = (long)block_num,
                block_time = block_time,
                account = account,
                name = name,
                data = data,
                data_hex = data_hex
            };
            if (trxActions.Any<TrxAction>((Func<TrxAction, bool>)(ad => ad.act_digest == act_digest)))
                return;
            trxActions.Add(trxAction);
        }

        private static IEnumerable<JObject> ToJObjects(IEnumerable<BsonDocument> bsons)
        {
            return bsons.Select(ToJObject).ToList();
        }

        private static JObject ToJObject(BsonDocument bson)
        {
            return JObject.Parse(ToJson(bson));
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
