const request = require('request')
const vhkdiosdk = require('./bip39/src/vhkdiosdk')

const privateKey = '5JNNWKaCoWvN5xojDXsW38Z6uoLmvM9NPh3coQD5z3TgsuY4nmt';

const createor = 'vgpaycreator';
const accountName = 'vgpayaabbcc1';
const pubkey = 'VHKD4z3UYgRaPzty7BJtkZmpyDX61QB5BaEp6JTd2DfkvKEpFZpkft';

let data = {
    creator: createor,
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

var options = {
    method: 'POST',
    url: 'http://192.168.1.61/v1/service/pack_transaction',
    headers: {
        'content-type': 'application/json'
    },
    body: {
        account: 'eosio',
        authorization: [{
            actor: createor,
            permission: 'active'
        }],
        name: 'newaccount',
        data: data
    },
    json: true
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    let serializedTransaction = body;
    let signTransaction = vhkdiosdk.vhkdiocoin.signTransaction({
        currency: 'vhkdiotest',
        key: privateKey,
        serializedTransaction: serializedTransaction
    })

    options = {
        method: 'POST',
        url: 'http://192.168.1.61/v1/chain/push_transaction',
        headers: {
            'Content-Type': 'application/json'
        },
        body: signTransaction.data,
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });

});