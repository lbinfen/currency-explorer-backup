const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

const defaultPrivateKey = "5JNNWKaCoWvN5xojDXsW38Z6uoLmvM9NPh3coQD5z3TgsuY4nmt";
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc('http://192.168.1.61', {
    fetch
});
const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});

const creator = 'vgpaycreator';
const accountName = 'vgpayaabbcc1';
const pubkey = 'VHKD4z3UYgRaPzty7BJtkZmpyDX61QB5BaEp6JTd2DfkvKEpFZpkft';

let data = {
    creator: creator,
    name: accountName,
    owner: {
        threshold: 1,
        keys: [{
            key: pubkey,
            weight: 1
        }],
        accounts: [],
        waits: []
    },
    active: {
        threshold: 1,
        keys: [{
            key: pubkey,
            weight: 1
        }],
        accounts: [],
        waits: []
    },
};

(async () => {
    const result = await api.transact({
        actions: [{
            account: 'eosio',
            name: 'newaccount',
            authorization: [{
                actor: creator,
                permission: 'active',
            }],
            data: data,
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
    console.dir(result);
})();