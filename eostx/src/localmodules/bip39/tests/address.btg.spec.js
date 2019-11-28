var assert = require('assert');
var HDWJS = require('../src/hdwsdk');
var BCOINJS = require('../src/bcoinsdk');

describe('BTG Address', function () {

  describe('#generateAddress() btg success', function () {

    it('should generate btg mainnet BIP44 address 1', function () {
      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "btg",
        purpose: 44,
        account: 0,
        change: 0,
        start: 0,
        end: 0
      };
      var addresses = HDWJS.hdWallet.generateAddresses(addressData);
      assert.equal(addresses.status, true);
      var address = addresses.data[0];
      console.log(address);
      assert.equal(address.path, "m/44'/156'/0'/0/0");
      assert.equal(address.address, "Gam16QAuEtLgyJ3LwjWEH8qLNk6wAdrxrv");
      assert.equal(address.pubkey, "027a6bbd00804aafe899a78e6b1d81e0a95351c95c5e8e3bf1ce340ef7f7f2f07b");
      assert.equal(address.privkey, "L2TaHWpdYjABxBLT5iYZ5HC43jtvsDJKzvuLNBSZt5ugBoneh39q");
    });

    it('should generate btg testnet BIP44 address 1', function () {
      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "btgtest",
        purpose: 44,
        account: 0,
        change: 0,
        start: 0,
        end: 0
      };
      var addresses = HDWJS.hdWallet.generateAddresses(addressData);
      assert.equal(addresses.status, true);
      var address = addresses.data[0];
      console.log(address);
      assert.equal(address.path, "m/44'/156'/0'/0/0");
      assert.equal(address.address, "mxS2yKvw54AefwDfjMpVgHhmKZuo4M6mKr");
      assert.equal(address.pubkey, "027a6bbd00804aafe899a78e6b1d81e0a95351c95c5e8e3bf1ce340ef7f7f2f07b");
      assert.equal(address.privkey, "cSpZkRpUynrT7coiU8MgSbh7fyCLXfQ24y3oUbu5PCZgSYspkohu");
    });

  });

  describe('#getXpubKeyByMnemonic() ok btg', function () {

    it('should generate btg BIP32 Extended Public Key by mnemonic for mainnet', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency = 'btg';
      let xpubKey = 'xpub6CN1qe6cHfCSCfSAaN8j1inVv4HaEm81Qkwo6EGanA6FgAVWYYoqpXnAkutrEFW8hgGjhJ2vScJQFPFX6yKS86WhE1LKJadSBeFDSvoAVtg';

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
      assert.equal(address1.path, "m/44'/156'/0'/0/0");
      assert.equal(address1.pubkey, "027a6bbd00804aafe899a78e6b1d81e0a95351c95c5e8e3bf1ce340ef7f7f2f07b");
      assert.equal(address1.privkey, "L2TaHWpdYjABxBLT5iYZ5HC43jtvsDJKzvuLNBSZt5ugBoneh39q");

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
      assert.equal(address21, "Gam16QAuEtLgyJ3LwjWEH8qLNk6wAdrxrv");
      var address22 = addresses2.data[1];
      assert.equal(address22, "GZS6MKorAgCHt82hppPQtQa4Cb8Jgdos9C");
    });

    it('should generate btg BIP32 Extended Public Key by mnemonic for testnet', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency = 'btgtest';
      let xpubKey = 'tpubDCjeMsvHzw9tUTd22Z7pDe7sFBPEE9d4xPY6SnKj84r9RTADcmevxySzzwydkkTNVaoeJsYnyi8SwZk8VqAg1XxzHc5cz7HfmbqdCzB3koH';

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
      assert.equal(address1.path, "m/44'/156'/0'/0/0");
      assert.equal(address1.pubkey, "027a6bbd00804aafe899a78e6b1d81e0a95351c95c5e8e3bf1ce340ef7f7f2f07b");
      assert.equal(address1.privkey, "cSpZkRpUynrT7coiU8MgSbh7fyCLXfQ24y3oUbu5PCZgSYspkohu");

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
      assert.equal(address21, "mxS2yKvw54AefwDfjMpVgHhmKZuo4M6mKr");
      var address22 = addresses2.data[1];
      assert.equal(address22, "mw78EFZszr2FamD2cShgHZSV9QwAamb44c");
    });

    it('should generate btg BIP32 Extended Public Key by mnemonic for testnet 2', function () {
      let mnemonic = "bread infant series isolate welcome toilet flip strike wink that taxi country pond crack worth";
      let currency = 'btgtest';
      let xpubKey = 'tpubDDSJ6JzDPtM81Ujr1BTQi2ozPxuXhFTPmMaXjcjF6CESnCQiWoXC7ppjeYdZ6RF494i2HzvwF8pXfHnyShfRHY2Rw77UegexotQ3uTuAMC8';
      var mnemonicData = {
        mnemonic: mnemonic,
        currency: currency,
        purpose: 44,
        account: 0,
      };
      var xpubKeyResult = HDWJS.hdWallet.getXpubKeyByMnemonic(mnemonicData);
      assert.equal(xpubKeyResult.status, true);
      assert.equal(xpubKeyResult.data, xpubKey);
    });

  });

  describe('#validateAddressByXpubKey() btg ok', function () {

    it('btg address should be valid', function () {
      var data = {
        xpubKey: "xpub6CN1qe6cHfCSCfSAaN8j1inVv4HaEm81Qkwo6EGanA6FgAVWYYoqpXnAkutrEFW8hgGjhJ2vScJQFPFX6yKS86WhE1LKJadSBeFDSvoAVtg",
        currency: 'btg',
        change: 0,
        index: 0,
        address: 'Gam16QAuEtLgyJ3LwjWEH8qLNk6wAdrxrv'
      };
      var validate = HDWJS.hdWallet.validateAddressByXpubKey(data);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

    it('btg address should be valid', function () {
      var data = {
        xpubKey: "tpubDC8gTVhjnToXzkE6sUYhCbRrHATDYMrgkDKkJ2jCD7zp45ohGWf14M23Ck9fh9pEngJMsQBagMzA5nR9Xb6wEqH2F47Qd7ZXJQxvNvB7hWC",
        currency: 'btgtest',
        change: 0,
        index: 0,
        address: 'mq6w28feA2cahy4iBgqCzprzU2SnqUixqF'
      };
      var validate = HDWJS.hdWallet.validateAddressByXpubKey(data);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

  describe('#generateAddressByWIF() btg ok', function () {

    it('can generate btg address', function () {
      var data = {
        wif: "L2TaHWpdYjABxBLT5iYZ5HC43jtvsDJKzvuLNBSZt5ugBoneh39q",
        currency: 'btg',
      };
      var address = HDWJS.hdWallet.generateAddressByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "Gam16QAuEtLgyJ3LwjWEH8qLNk6wAdrxrv");
    });

    it('can generate btg address', function () {
      var data = {
        wif: "cSpZkRpUynrT7coiU8MgSbh7fyCLXfQ24y3oUbu5PCZgSYspkohu",
        currency: 'btgtest',
      };
      var address = HDWJS.hdWallet.generateAddressByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "mxS2yKvw54AefwDfjMpVgHhmKZuo4M6mKr");
    });

  });

  describe('#validateAddress() btg ok', function () {

    it('btg address should be valid', function () {
      var data = {
        currency: 'btg',
        address: 'Gam16QAuEtLgyJ3LwjWEH8qLNk6wAdrxrv'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

    it('btg address should be valid', function () {
      var data = {
        currency: 'btgtest',
        address: 'mq6w28feA2cahy4iBgqCzprzU2SnqUixqF'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

});