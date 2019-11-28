var assert = require('assert');
var HDWJS = require('../src/hdwsdk');
var ECOINJS = require('../src/ecoinsdk');

describe('BTL Address', function () {

  describe('#generateAddress() btl success', function () {

    it('should generate btl mainnet BIP44 address 1', function () {
      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "btl",
        purpose: 44,
        account: 0,
        change: 0,
        start: 0,
        end: 0
      };
      var addresses = HDWJS.hdWallet.generateAddresses(addressData);
      assert.equal(addresses.status, true);
      var address = addresses.data[0];
      assert.equal(address.path, "m/44'/999994'/0'/0/0");
      assert.equal(address.address, "Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV");
      assert.equal(address.pubkey, "0221a40ea5a80ccb1b9f6853d9cb390d2955337c1678da2a3dea9591a87284cd36");
      assert.equal(address.privkey, "L2e85EDo7cthqfTm8zQD7eLTw755rVcequhsEcYEiRTuvpc6Ys44");
    });

    it('should generate btl mainnet BIP44 address 1', function () {

      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "btltest",
        purpose: 44,
        account: 0,
        change: 1,
        start: 0,
        end: 10
      };
      var addresses = HDWJS.hdWallet.generateAddresses(addressData);
      assert.equal(addresses.status, true);
      var address1 = addresses.data[0];
      assert.equal(address1.path, "m/44'/999994'/0'/1/0");
      assert.equal(address1.address, "LcvvxiWBbHSCftnZrRZ6S5wbyrw31W7nH8");
      assert.equal(address1.pubkey, "035239eaeb9314f67152cebd60c6eaec01af872cb2237104a58afdfd6bdbf39490");
      assert.equal(address1.privkey, "L4r8uFiCe2YyNtAE9iRgnGSe5NP33PjLLW16XxtHZzaLa8p2Dh1V");

      var address2 = addresses.data[1];
      assert.equal(address2.path, "m/44'/999994'/0'/1/1");
      assert.equal(address2.address, "LP9z5jpGeZnpcvZnPto8LAdXYXY3EfrWBu");
      assert.equal(address2.pubkey, "024ad20b54d4d42f431295a6e1c43cc6e2cc75e0ec4cf9dde7a419396d5d086232");
      assert.equal(address2.privkey, "KxgNZBjn7VdQxdoPiKL2dRAUynEz1ksLRAtVrdDc5xwsMWU3CvRm");

    });

    it('should generate btl testnet BIP44 address 2', function () {
      var addressData = {
        mnemonic: "egg,sudden,advance,apple,salmon,mad,crowd,ginger,essence,fork,public,funny",
        passphrase: "",
        currency: "btl",
        purpose: 44,
        account: 0,
        change: 0,
        start: 0,
        end: 0
      };
      var addresses = HDWJS.hdWallet.generateAddresses(addressData);
      console.log(addresses)
      assert.equal(addresses.status, true);
      var address = addresses.data[0];
      assert.equal(address.path, "m/44'/999994'/0'/0/0");
      assert.equal(address.address, "LVkTFsWh9fk1esZ4nk4f7hH47P84NFk8Jn");
      assert.equal(address.pubkey, "03b75f0e980005f8ace5fb4f43e6eaed5c948be4dcfcf929825c36107062bc2b61");
      assert.equal(address.privkey, "L28nmxfzMSfAt4b49v15iNa18AwP7cT3eZieiARkcGgNyWGMBMp5");
    });

  });

  describe('#getXpubKeyByMnemonic() ok btl', function () {

    it('should generate btl BIP32 Extended Public Key by mnemonic for mainnet', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency = 'btl';
      let xpubKey = 'xpub6CWcKBKHRkt31fghSvMtf1Ky5bqnA9RuVGzKKcYNockGX24WcEpKS1WWn3ek1ghe8HsS4Y5mer9Hy6cFni9ZQSzYucR9P7HxFGASk1nJfCc';

      var addressData = {
        mnemonic: mnemonic,
        passphrase: "",
        currency: currency,
        purpose: 44,
        account: 0,
        change: 0,
        start: 0,
        end: 0
      };
      var addresses1 = HDWJS.hdWallet.generateAddresses(addressData);
      assert.equal(addresses1.status, true);
      var address1 = addresses1.data[0];
      assert.equal(address1.path, "m/44'/999994'/0'/0/0");
      assert.equal(address1.address, "Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV");
      assert.equal(address1.pubkey, "0221a40ea5a80ccb1b9f6853d9cb390d2955337c1678da2a3dea9591a87284cd36");
      assert.equal(address1.privkey, "L2e85EDo7cthqfTm8zQD7eLTw755rVcequhsEcYEiRTuvpc6Ys44");

      var mnemonicData = {
        mnemonic: mnemonic,
        currency: currency,
        purpose: 44,
        account: 0,
      };
      var xpubKeyResult = HDWJS.hdWallet.getXpubKeyByMnemonic(mnemonicData);
      assert.equal(xpubKeyResult.status, true);
      assert.equal(xpubKeyResult.data, xpubKey);

      var xpubKeyData = {
        xpubKey: xpubKey,
        currency: currency,
        change: 0,
        start: 0,
        end: 1
      };
      var addresses2 = HDWJS.hdWallet.generateAddressesByXpubKey(xpubKeyData);
      assert.equal(addresses2.status, true);
      var address21 = addresses2.data[0];
      assert.equal(address21, "Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV");
      var address22 = addresses2.data[1];
      assert.equal(address22, "LQ2iNxCa1j3v9LA3PMkgsDtQHbNi99Ca4h");
    });

    it('should generate btl BIP32 Extended Public Key by mnemonic for testnet', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency = 'btltest';
      let xpubKey = 'xpub6CWcKBKHRkt31fghSvMtf1Ky5bqnA9RuVGzKKcYNockGX24WcEpKS1WWn3ek1ghe8HsS4Y5mer9Hy6cFni9ZQSzYucR9P7HxFGASk1nJfCc';

      var addressData = {
        mnemonic: mnemonic,
        passphrase: "",
        currency: currency,
        purpose: 44,
        account: 0,
        change: 0,
        start: 0,
        end: 0
      };
      var addresses1 = HDWJS.hdWallet.generateAddresses(addressData);
      assert.equal(addresses1.status, true);
      var address1 = addresses1.data[0];
      assert.equal(address1.path, "m/44'/999994'/0'/0/0");
      assert.equal(address1.address, "Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV");
      assert.equal(address1.pubkey, "0221a40ea5a80ccb1b9f6853d9cb390d2955337c1678da2a3dea9591a87284cd36");
      assert.equal(address1.privkey, "L2e85EDo7cthqfTm8zQD7eLTw755rVcequhsEcYEiRTuvpc6Ys44");

      var mnemonicData = {
        mnemonic: mnemonic,
        currency: currency,
        purpose: 44,
        account: 0,
      };
      var xpubKeyResult = HDWJS.hdWallet.getXpubKeyByMnemonic(mnemonicData);
      assert.equal(xpubKeyResult.status, true);
      assert.equal(xpubKeyResult.data, xpubKey);

      var xpubKeyData = {
        xpubKey: xpubKey,
        currency: currency,
        change: 0,
        start: 0,
        end: 1
      };
      var addresses2 = HDWJS.hdWallet.generateAddressesByXpubKey(xpubKeyData);
      assert.equal(addresses2.status, true);
      var address21 = addresses2.data[0];
      assert.equal(address21, "Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV");
      var address22 = addresses2.data[1];
      assert.equal(address22, "LQ2iNxCa1j3v9LA3PMkgsDtQHbNi99Ca4h");
    });

  });

  describe('#validateAddressByXpubKey() btl ok', function () {

    it('btl address should be valid', function () {
      var data = {
        xpubKey: "xpub6CWcKBKHRkt31fghSvMtf1Ky5bqnA9RuVGzKKcYNockGX24WcEpKS1WWn3ek1ghe8HsS4Y5mer9Hy6cFni9ZQSzYucR9P7HxFGASk1nJfCc",
        currency: 'btl',
        change: 0,
        index: 0,
        address: 'Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV'
      };
      var validate = HDWJS.hdWallet.validateAddressByXpubKey(data);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

  describe('#generateAddressByWIF() btl ok', function () {

    it('can generate btl address', function () {
      var data = {
        wif: "L2e85EDo7cthqfTm8zQD7eLTw755rVcequhsEcYEiRTuvpc6Ys44",
        currency: 'btl',
      };
      var address = HDWJS.hdWallet.generateAddressByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV");
    });

  });

  describe('#validateAddress() btl ok', function () {

    it('btl address should be valid', function () {
      var data = {
        currency: 'btl',
        address: 'Lf5j58JPTtKb6dJ94gVSmBr7GrjXhraaqG'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

  describe('#validateAddress() btl ok', function () {

    it('btl address should be valid', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency1 = 'btl';
      let xpubKey1 = 'xpub6CWcKBKHRkt31fghSvMtf1Ky5bqnA9RuVGzKKcYNockGX24WcEpKS1WWn3ek1ghe8HsS4Y5mer9Hy6cFni9ZQSzYucR9P7HxFGASk1nJfCc';
      var mnemonicData1 = {
        mnemonic: mnemonic,
        currency: currency1,
        purpose: 44,
        account: 0,
      };
      var xpubKeyResult1 = HDWJS.hdWallet.getXpubKeyByMnemonic(mnemonicData1);
      assert.equal(xpubKeyResult1.status, true);
      assert.equal(xpubKeyResult1.data, xpubKey1);
      let currency2 = 'btl';
      let xpubKey2 = 'xpub6CWcKBKHRkt31fghSvMtf1Ky5bqnA9RuVGzKKcYNockGX24WcEpKS1WWn3ek1ghe8HsS4Y5mer9Hy6cFni9ZQSzYucR9P7HxFGASk1nJfCc';
      let mnemonicData2 = {
        mnemonic: mnemonic,
        currency: currency2,
        purpose: 44,
        account: 0,
      };
      let xpubKeyResult2 = HDWJS.hdWallet.getXpubKeyByMnemonic(mnemonicData2);
      assert.equal(xpubKeyResult2.status, true);
      assert.equal(xpubKeyResult2.data, xpubKey2);

    });

  });

});