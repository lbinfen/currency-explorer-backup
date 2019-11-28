var assert = require('assert');
var HDWJS = require('../src/hdwsdk');

describe('VHKDIO Address', function () {

  describe('#generateAddress() vhkdio success', function () {

    it('should generate VHKD mainnet BIP44 address 1', function () {
      var addressData = {
        mnemonic: "grocery penalty actual chapter state law mention apple jar any artwork burger leopard dry artist",
        passphrase: "",
        currency: "vhkdio",
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
      assert.equal(address.address, "");
      assert.equal(address.pubkey, "VHKD5HnjJs5oYhxfT6Vy5sd1PmUXQQvxTjjZjaVE65EGZnEWgDhG4D");
      assert.equal(address.privkey, "5JqQTPekBQrgYmxB8gEZ4WLrCTW58Ec2BS1EQWv3VRo6ewtrmfp");
    });

    it('should generate VHKD testnet BIP44 address 2', function () {
      var addressData = {
        mnemonic: "egg,sudden,advance,apple,salmon,mad,crowd,ginger,essence,fork,public,funny",
        passphrase: "",
        currency: "vhkdio",
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
      assert.equal(address.address, "");
      assert.equal(address.pubkey, "VHKD7xRxaAQx9Ns7cKq1GvYhh2XGQoFu1DpsHqXxR83dAusLNmqCaY");
      assert.equal(address.privkey, "5KKHnmuf4XhjQnKT1BQTL96rQK1PhDXbPHKhTWKGYMByzDgAWTC");
    });

  });

  describe('#generatePubkeyByWIF() vhkdio ok', function () {

    it('can generate vhkdio pubkey', function () {
      var data = {
        wif: "5KgGBDicAMdGxK6JuDgki7hRdwDWZHjxSTDfeXCj5ibiNuRmQMj",
        currency: 'vhkdio',
      };
      var address = HDWJS.hdWallet.generatePubkeyByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "VHKD5KyMNCZEK4MoK5iiLNh2n48qKBsKZWzBfgGUmtxGkEXxhdPjhe");
    });

    it('can generate vhkdio pubkey', function () {
      var data = {
        wif: "5K1qM9htPT6Z7EgHFcceUxPU7wswSQtDw9DAT9tW1rbMNkCWKFT",
        currency: 'vhkdio',
      };
      var address = HDWJS.hdWallet.generatePubkeyByWIF(data);
      console.log(address);
      assert.equal(address.status, true);
      assert.equal(address.data, "VHKD7gFA7DuXe6SiQuX5zsipciTmQsXa2ZJmNxcHgcJHRzhfVqzZxM");
    });

  });

});