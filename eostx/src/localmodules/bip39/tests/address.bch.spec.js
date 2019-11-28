var assert = require('assert');
var HDWJS = require('../src/hdwsdk');
var BCOINJS = require('../src/bcoinsdk');

describe('BCHABC Address', function () {

  describe('#generateAddress() bchabc success', function () {

    it('should generate bchabc mainnet BIP44 address 1', function () {
      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "bchabc",
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
      assert.equal(address.path, "m/44'/145'/0'/0/0");
      assert.equal(address.legacyAddress, "1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
      assert.equal(address.address, "bitcoincash:qp5jvd06n6hra7phet8l3y5wwa7amry2e5e8uca6w0");
      assert.equal(address.bitpayAddress, "CS3sJ7vjE49rpzVX9sBkkRGhEA4Vu7KBtQ");
      assert.equal(address.pubkey, "0296fb88425e1fc06456bddb5db9af0639b46ecea4a7ace655164a7128dd546b26");
      assert.equal(address.privkey, "L4NSNY5BwWhoCy3FRkqmZRSuZWiKKDkfn5wLEHM7zgAUmicDS5bh");
    });

    it('should generate bchabc testnet BIP44 address 1', function () {
      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "bchabctest",
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
      assert.equal(address.path, "m/44'/145'/0'/0/0");
      assert.equal(address.legacyAddress, "mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
      assert.equal(address.address, "bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn");
      assert.equal(address.bitpayAddress, "mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
      assert.equal(address.pubkey, "0296fb88425e1fc06456bddb5db9af0639b46ecea4a7ace655164a7128dd546b26");
      assert.equal(address.privkey, "cUjRqT53NaQ4NQWWpAetvjwyBk1iyfrMr85oLhodVnpV2ThCY8i9");
    });

    it('should convert bchabc maintest addresses ', function () {
      let cashAddress1 = BCOINJS.bcoin.toCashAddressForBCH("1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
      assert.equal(cashAddress1.data, "bitcoincash:qp5jvd06n6hra7phet8l3y5wwa7amry2e5e8uca6w0");
      let cashAddress2 = BCOINJS.bcoin.toCashAddressForBCH("bitcoincash:qp5jvd06n6hra7phet8l3y5wwa7amry2e5e8uca6w0");
      assert.equal(cashAddress2.data, "bitcoincash:qp5jvd06n6hra7phet8l3y5wwa7amry2e5e8uca6w0");
      let legacyAddress1 = BCOINJS.bcoin.toLegacyAddressForBCH("bitcoincash:qp5jvd06n6hra7phet8l3y5wwa7amry2e5e8uca6w0");
      assert.equal(legacyAddress1.data, "1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
      let legacyAddress2 = BCOINJS.bcoin.toLegacyAddressForBCH("1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
      assert.equal(legacyAddress2.data, "1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
    });

    it('should convert bchabc testnet addresses ', function () {
      let cashAddress1 = BCOINJS.bcoin.toCashAddressForBCH("mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
      assert.equal(cashAddress1.data, "bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn");
      let cashAddress2 = BCOINJS.bcoin.toCashAddressForBCH("bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn");
      assert.equal(cashAddress2.data, "bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn");
      let legacyAddress1 = BCOINJS.bcoin.toLegacyAddressForBCH("bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn");
      assert.equal(legacyAddress1.data, "mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
      let legacyAddress2 = BCOINJS.bcoin.toLegacyAddressForBCH("mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
      assert.equal(legacyAddress2.data, "mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
    });

  });

  describe('#getXpubKeyByMnemonic() ok bchabc', function () {

    it('should generate bchabc BIP32 Extended Public Key by mnemonic for mainnet', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency = 'bchabc';
      let xpubKey = 'xpub6Bm3wFt45Br5ix3FRHZbzg6Ux3MZYyMdCajSwUg3sDEvJo8zCHouuuMCxi4tAerzzmmTFpfi9GA7PbvY8jFhMPpjBTN6wauHiTNWcvowHH6';

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
      assert.equal(address1.path, "m/44'/145'/0'/0/0");
      assert.equal(address1.legacyAddress, "1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
      assert.equal(address1.pubkey, "0296fb88425e1fc06456bddb5db9af0639b46ecea4a7ace655164a7128dd546b26");
      assert.equal(address1.privkey, "L4NSNY5BwWhoCy3FRkqmZRSuZWiKKDkfn5wLEHM7zgAUmicDS5bh");

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
      assert.equal(address21, "1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
      var address22 = addresses2.data[1];
      assert.equal(address22, "1CFaTRnFb5r21S555Juhatc9kJFssNVdcF");
    });

    it('should generate bchabc BIP32 Extended Public Key by mnemonic for testnet', function () {
      let mnemonic = "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist";
      let currency = 'bchabctest';
      let xpubKey = 'tpubDC8gTVhjnToXzkE6sUYhCbRrHATDYMrgkDKkJ2jCD7zp45ohGWf14M23Ck9fh9pEngJMsQBagMzA5nR9Xb6wEqH2F47Qd7ZXJQxvNvB7hWC';

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
      assert.equal(address1.path, "m/44'/145'/0'/0/0");
      assert.equal(address1.legacyAddress, "mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
      assert.equal(address1.pubkey, "0296fb88425e1fc06456bddb5db9af0639b46ecea4a7ace655164a7128dd546b26");
      assert.equal(address1.privkey, "cUjRqT53NaQ4NQWWpAetvjwyBk1iyfrMr85oLhodVnpV2ThCY8i9");

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
      assert.equal(address21, "mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
      var address22 = addresses2.data[1];
      assert.equal(address22, "mrmXkUsEQ7HGnYYgnst5QopUcHrakkWgEg");
    });

    it('should generate bchabc BIP32 Extended Public Key by mnemonic for testnet 2', function () {
      let mnemonic = "bread infant series isolate welcome toilet flip strike wink that taxi country pond crack worth";
      let currency = 'bchabctest';
      let xpubKey = 'tpubDDPTjV3u2MtNebtPiNNMmHxGoHQYrGXEHeeE3RGT74epSK7ZuVLMDWJCAuUXfvFur32YGQ1bKBovPQSRiC2kjPMbq4p4a27Q6wNCtySqWdC';
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

  describe('#validateAddressByXpubKey() bchabc ok', function () {

    it('bchabc address should be valid', function () {
      var data = {
        xpubKey: "xpub6Bm3wFt45Br5ix3FRHZbzg6Ux3MZYyMdCajSwUg3sDEvJo8zCHouuuMCxi4tAerzzmmTFpfi9GA7PbvY8jFhMPpjBTN6wauHiTNWcvowHH6",
        currency: 'bchabc',
        change: 0,
        index: 0,
        address: '1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb'
      };
      var validate = HDWJS.hdWallet.validateAddressByXpubKey(data);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

    it('bchabc address should be valid', function () {
      var data = {
        xpubKey: "tpubDC8gTVhjnToXzkE6sUYhCbRrHATDYMrgkDKkJ2jCD7zp45ohGWf14M23Ck9fh9pEngJMsQBagMzA5nR9Xb6wEqH2F47Qd7ZXJQxvNvB7hWC",
        currency: 'bchabctest',
        change: 0,
        index: 0,
        address: 'mq6w28feA2cahy4iBgqCzprzU2SnqUixqF'
      };
      var validate = HDWJS.hdWallet.validateAddressByXpubKey(data);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

  describe('#generateAddressByWIF() bchabc ok', function () {

    it('can generate bchabc address', function () {
      var data = {
        wif: "L4NSNY5BwWhoCy3FRkqmZRSuZWiKKDkfn5wLEHM7zgAUmicDS5bh",
        currency: 'bchabc',
      };
      var address = HDWJS.hdWallet.generateAddressByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb");
    });

    it('can generate bchabc address', function () {
      var data = {
        wif: "cUjRqT53NaQ4NQWWpAetvjwyBk1iyfrMr85oLhodVnpV2ThCY8i9",
        currency: 'bchabctest',
      };
      var address = HDWJS.hdWallet.generateAddressByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "mq6w28feA2cahy4iBgqCzprzU2SnqUixqF");
    });

  });

  describe('#validateAddress() bchabc ok', function () {

    it('bchabc address should be valid', function () {
      var data = {
        currency: 'bchabc',
        address: '1Aayj5afM1BKvrb6U7rqAuefc2r5wFq5sb'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

    it('bchabc cash address should be valid', function () {
      var data = {
        currency: 'bchabc',
        address: 'bitcoincash:qp5jvd06n6hra7phet8l3y5wwa7amry2e5e8uca6w0'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

    it('bchabc address should be valid', function () {
      var data = {
        currency: 'bchabctest',
        address: 'mq6w28feA2cahy4iBgqCzprzU2SnqUixqF'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

    it('bchabc cash address should be valid', function () {
      var data = {
        currency: 'bchabctest',
        address: 'bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn'
      };
      var validate = HDWJS.hdWallet.validateAddress(data);
      console.log(validate);
      assert.equal(validate.status, true);
      assert.equal(validate.data, true);
    });

  });

});