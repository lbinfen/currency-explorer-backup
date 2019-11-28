using System;
using System.Linq;
using System.Threading.Tasks;
using EosSharp;
using EosSharp.Core;
using EosSharp.Core.Helpers;
using EosSharp.Core.Providers;
using EosSharp.Core.Api.v1;
using System.Collections.Generic;

namespace newaccountdemo
{
    class Program
    {
        static void Main(string[] args)
        {
            var creator = "vgpaycreator";
            var pubkey = "VHKD6xbA7CjjbhnUxmD2pbKA7zVeCYKe2j61QxRD8PHgkKofD6beds";
            try
            {
                var result = CreateTransaction(new Transaction()
                {
                    actions = new List<EosSharp.Core.Api.v1.Action>()
                    {
                        new EosSharp.Core.Api.v1.Action()
                        {
                            account = "eosio",
                            authorization = new List<PermissionLevel>()
                            {
                                new PermissionLevel() {actor = creator, permission = "active" }
                            },
                            name = "newaccount",
                            data = new Dictionary<string, object>()
                            {
                                { "creator", creator },
                                { "name", "vgpay3hkcisz" },
                                { "owner", new Dictionary<string, object>() {
                                        { "threshold", 1},
                                        { "keys", new Dictionary<string, object>[]{
                                            new Dictionary<string, object>() {
                                                { "key", pubkey },
                                                { "weight", 1}
                                            }
                                        }},
                                        { "accounts", new List<object>() },
                                        { "waits" , new List<object>() }
                                }},
                                { "active", new Dictionary<string, object>() {
                                        { "threshold", 1},
                                        { "keys", new Dictionary<string, object>[]{
                                            new Dictionary<string, object>() {
                                                { "key", pubkey },
                                                { "weight", 1}
                                            }
                                        }},
                                        { "accounts", new List<object>() },
                                        { "waits" , new List<object>() }
                                }
                                }
                            }
                        }
                    }
                }).Result;
                Console.WriteLine(result);
            }
            catch (System.Exception ex)
            {
                if (ex.InnerException is EosSharp.Core.Exceptions.ApiErrorException)
                {
                    Console.WriteLine(((EosSharp.Core.Exceptions.ApiErrorException)ex.InnerException).error.what);
                }
                else
                {
                    throw ex;
                }
            }
            Console.WriteLine("Hello World!");
        }

        public static async Task<string> CreateTransaction(Transaction trx)
        {
            core.Services.AbiSerializationProvider.Prefix = "VHKD";
            var eosConfig = new EosConfigurator()
            {
                HttpEndpoint = "http://192.168.1.61", //Mainnet
                ExpireSeconds = 60,
                ChainId = "afe97f023511453c09c64f5bb655e7f4dc6694685aff7231219964e9cc521585",
                SignProvider = new core.Services.DefaultSignProvider("5JNNWKaCoWvN5xojDXsW38Z6uoLmvM9NPh3coQD5z3TgsuY4nmt", "VHKD")
            };
            var api = new EosApi(eosConfig, new HttpHandler());
            var abiSerializer = new core.Services.AbiSerializationProvider(api);

            if (eosConfig.SignProvider == null)
                throw new ArgumentNullException("SignProvider");

            GetInfoResponse getInfoResult = null;
            string chainId = eosConfig.ChainId;

            if (string.IsNullOrWhiteSpace(chainId))
            {
                getInfoResult = await api.GetInfo();
                chainId = getInfoResult.chain_id;
            }

            if (trx.expiration == DateTime.MinValue ||
               trx.ref_block_num == 0 ||
               trx.ref_block_prefix == 0)
            {
                if (getInfoResult == null)
                    getInfoResult = await api.GetInfo();

                var getBlockResult = await api.GetBlock(new GetBlockRequest()
                {
                    block_num_or_id = getInfoResult.last_irreversible_block_num.ToString()
                });

                trx.expiration = getInfoResult.head_block_time.AddSeconds(eosConfig.ExpireSeconds);
                trx.ref_block_num = (UInt16)(getInfoResult.last_irreversible_block_num & 0xFFFF);
                trx.ref_block_prefix = getBlockResult.ref_block_prefix;
            }

            var packedTrx = await abiSerializer.SerializePackedTransaction(trx);
            var availableKeys = await eosConfig.SignProvider.GetAvailableKeys();
            var requiredKeys = await GetRequiredKeys(api, abiSerializer, availableKeys.ToList(), trx);

            IEnumerable<string> abis = null;

            if (trx.actions != null)
                abis = trx.actions.Select(a => a.account);

            var signatures = await eosConfig.SignProvider.Sign(chainId, requiredKeys, packedTrx, abis);

            var result = await api.PushTransaction(new PushTransactionRequest()
            {
                signatures = signatures.ToArray(),
                compression = 0,
                packed_context_free_data = "",
                packed_trx = SerializationHelper.ByteArrayToHexString(packedTrx)
            });

            return result.transaction_id;
        }

        /// <summary>
        /// Calculate required keys to sign the given transaction
        /// </summary>
        /// <param name="availableKeys">available public keys list</param>
        /// <param name="trx">transaction requiring signatures</param>
        /// <returns>required public keys</returns>
        public static async Task<List<string>> GetRequiredKeys(EosApi api, core.Services.AbiSerializationProvider abiSerializer, List<string> availableKeys, Transaction trx)
        {
            int actionIndex = 0;
            var abiResponses = await abiSerializer.GetTransactionAbis(trx);

            foreach (var action in trx.context_free_actions)
            {
                action.data = SerializationHelper.ByteArrayToHexString(abiSerializer.SerializeActionData(action, abiResponses[actionIndex++]));
            }

            foreach (var action in trx.actions)
            {
                action.data = SerializationHelper.ByteArrayToHexString(abiSerializer.SerializeActionData(action, abiResponses[actionIndex++]));
            }

            return (await api.GetRequiredKeys(new GetRequiredKeysRequest()
            {
                available_keys = availableKeys,
                transaction = trx
            })).required_keys;
        }
    }
}
