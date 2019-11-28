var assert = require('assert');
var HDWJS = require('../src/hdwsdk');
var ECOINJS = require('../src/ecoinsdk');

describe('VHKD Address', function () {

  describe('#generateAddress() vhkd success', function () {

    it('should generate VHKD mainnet BIP44 address 1', function () {
      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "vhkd",
        purpose: 44,
        account: 0,
        change: 0,
        start: 0,
        end: 0
      };
      var addresses = HDWJS.hdWallet.generateAddresses(addressData);
      assert.equal(addresses.status, true);
      var address = addresses.data[0];
      assert.equal(address.path, "m/44'/999991'/0'/0/0");
      assert.equal(address.address, "VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC");
      assert.equal(address.pubkey, "0234e792e62ac2b3c053cc723fe0e45a24a0068a8bea8a73d43dac42097a4c3c52");
      assert.equal(address.privkey, "L1ieXUybaxJHZFQXitApWUWc9ZyKCw3aD3N2Ao37zUSTxKFkAomH");
    });

    it('should generate VHKD testnet BIP44 address 2', function () {
      var addressData = {
        mnemonic: "egg,sudden,advance,apple,salmon,mad,crowd,ginger,essence,fork,public,funny",
        passphrase: "",
        currency: "vhkd",
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
      assert.equal(address.path, "m/44'/999991'/0'/0/0");
      assert.equal(address.address, "VTD8CCwwtzMLdVVa7oJdHXgqf1bewbpBh3");
      assert.equal(address.pubkey, "039409b25aeda4686f8e94c0eacb90bd6c516ca0967f737d2b7b773bc53075e784");
      assert.equal(address.privkey, "L3qj73DQzaWnBy2RmnvXDUkq3tUjAWJ2mM3XZzPdbN7UXW444fGS");
    });

  });

  describe('#getXpubKeyByMnemonic() ok vhkd', function () {

    it('should generate vhkd BIP32 Extended Public Key by mnemonic', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency = 'vhkd';
      let xpubKey = 'xpub6D3mM7DRKcLSip6WQBe1NYKpZMc1o8JY3P3jq3D6BXuUcJKD9YjrzxwaawWfpYKMWFhqRmqhWfNFVHZBVVK5FYrs8FTiZZRJwrfQkqgp3D4';

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
      assert.equal(address1.path, "m/44'/999991'/0'/0/0");
      assert.equal(address1.address, "VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC");
      assert.equal(address1.pubkey, "0234e792e62ac2b3c053cc723fe0e45a24a0068a8bea8a73d43dac42097a4c3c52");
      assert.equal(address1.privkey, "L1ieXUybaxJHZFQXitApWUWc9ZyKCw3aD3N2Ao37zUSTxKFkAomH");

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
      assert.equal(address21, "VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC");
      var address22 = addresses2.data[1];
      assert.equal(address22, "VVJvR7K99JbKfoXmsEVV8kTREv7Bnx9SHr");
    });

  });

  describe('#validateAddressByXpubKey() vhkd ok', function () {

    it('vhkd address should be valid', function () {
      var data = {
        xpubKey: "xpub6D3mM7DRKcLSip6WQBe1NYKpZMc1o8JY3P3jq3D6BXuUcJKD9YjrzxwaawWfpYKMWFhqRmqhWfNFVHZBVVK5FYrs8FTiZZRJwrfQkqgp3D4",
        currency: 'vhkd',
        change: 0,
        index: 0,
        address: 'VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC'
      };
      var validate = HDWJS.hdWallet.validateAddressByXpubKey(data);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

  describe('#generateAddressByWIF() vhkd ok', function () {

    it('can generate vhkd address', function () {
      var data = {
        wif: "L1ieXUybaxJHZFQXitApWUWc9ZyKCw3aD3N2Ao37zUSTxKFkAomH",
        currency: 'vhkd',
      };
      var address = HDWJS.hdWallet.generateAddressByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC");
    });

  });

  describe('#validateAddress() vhkd ok', function () {

    it('vhkd address should be valid', function () {
      var data = {
        currency: 'vhkd',
        address: 'VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

  describe('#validateAddress() vhkd ok', function () {

    it('vhkd address should be valid', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency1 = 'vhkd';
      let xpubKey1 = 'xpub6D3mM7DRKcLSip6WQBe1NYKpZMc1o8JY3P3jq3D6BXuUcJKD9YjrzxwaawWfpYKMWFhqRmqhWfNFVHZBVVK5FYrs8FTiZZRJwrfQkqgp3D4';
      var mnemonicData1 = {
        mnemonic: mnemonic,
        currency: currency1,
        purpose: 44,
        account: 0,
      };
      var xpubKeyResult1 = HDWJS.hdWallet.getXpubKeyByMnemonic(mnemonicData1);
      assert.equal(xpubKeyResult1.status, true);
      assert.equal(xpubKeyResult1.data, xpubKey1);
      let currency2 = 'btc';
      let xpubKey2 = 'xpub6DQnsuBPsihtcNbQVQPvbCptu8dokRYd6ZLEYWf1gp3fEnjELyoLJaK7dTLG7KMbp7J1bWb17rm7rPDKxCkgjYWzDmLK9YG2p5o5hANDuxc';
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