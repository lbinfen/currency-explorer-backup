var assert = require('assert');
var BCOINJS = require('../src/bcoinsdk');

describe('LTC Transaction', function () {

  describe('#createTransaction()', function () {

    it('should calculate fee', function () {
      var coinData = {
        currency: 'btltest',
        utxos: [{
          txId: '18dfd9a8df4a2569de6ede077ffa030660e29ee39d3f5da03136a74624935165',
          vout: 1,
          value: 100000000000,
        }],
        targets: [{
          address: 'LQ2iNxCa1j3v9LA3PMkgsDtQHbNi99Ca4h',
          value: 500000
        }],
        feeRate: 50000
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 50000);
    });

    it('should build transaction ok', function () {
      var coinData = {
        currency: 'btltest',
        utxos: [{
          txId: '18dfd9a8df4a2569de6ede077ffa030660e29ee39d3f5da03136a74624935165',
          vout: 1,
          value: 100000000000,
          key: 'L2e85EDo7cthqfTm8zQD7eLTw755rVcequhsEcYEiRTuvpc6Ys44'
        }],
        targets: [{
          address: 'LQ2iNxCa1j3v9LA3PMkgsDtQHbNi99Ca4h',
          value: 500000000
        }],
        feeRate: 50000,
        changeAddress: 'LP9z5jpGeZnpcvZnPto8LAdXYXY3EfrWBu'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '01000000016551932446a73631a05d3f9de39ee2600603fa7f07de6ede69254adfa8d9df18010000006b483045022100aa55a96a7cfa3346567717cdf14060842c840a9a19655e48bb0ff3c9a53cab0d0220106bf81560a0ef26419101e7e2c1008cd7a727ebefe9a38a90f7081046e3250d01210221a40ea5a80ccb1b9f6853d9cb390d2955337c1678da2a3dea9591a87284cd36ffffffff020065cd1d000000001976a91434b876b6b5e70cb2cf79e2b2dcff45352e550e9588acb0bfa82a170000001976a9142b205ba9b07919dda5fd6660c6192fe0b54d31e088ac00000000');
    });

    it('should build transaction ok 2', function () {
      var coinData = {
        currency: 'btltest',
        utxos: [{
          txId: '28a0fb9d5f76bf69672fccd0d5b182529b9af5f3c37642288d5082c361e77ef7',
          vout: 1,
          value: 99499950000,
          key: 'KxgNZBjn7VdQxdoPiKL2dRAUynEz1ksLRAtVrdDc5xwsMWU3CvRm'
        }],
        targets: [{
          address: 'Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV',
          value: 500000000
        }],
        feeRate: 50000,
        changeAddress: 'LP9z5jpGeZnpcvZnPto8LAdXYXY3EfrWBu'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0100000001f77ee761c382508d284276c3f3f59a9b5282b1d5d0cc2f6769bf765f9dfba028010000006a4730440220562d2dafcfddd98c98707cc50f4b9e3d85d6e7824ce1170f1720c603fedbc0c3022025542cc8da13528856bfbd31c7d4639cbf320e489c310744b1c96691bce518a20121024ad20b54d4d42f431295a6e1c43cc6e2cc75e0ec4cf9dde7a419396d5d086232ffffffff020065cd1d000000001976a914ed932dfc2e62dfd944d8315288297337a8e0a4f488ac6097da0c170000001976a9142b205ba9b07919dda5fd6660c6192fe0b54d31e088ac00000000');
    });

    it('should build transaction ok with fully transfer', function () {
      var coinData = {
        currency: 'btltest',
        utxos: [{
          txId: '28a0fb9d5f76bf69672fccd0d5b182529b9af5f3c37642288d5082c361e77ef7',
          vout: 1,
          value: 99499950000,
          key: 'KxgNZBjn7VdQxdoPiKL2dRAUynEz1ksLRAtVrdDc5xwsMWU3CvRm'
        }],
        targets: [{
          address: 'Lgt8itxtEK7yNXLtN7ioyVatGNMrSQzXzV',
          value: 99499950000
        }],
        feeRate: 50000,
        changeAddress: 'LP9z5jpGeZnpcvZnPto8LAdXYXY3EfrWBu'
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      coinData.targets[0].value = coinData.targets[0].value - Math.round(fee.data * 1.1 + 0.5);
      console.log(coinData.targets[0]);
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0100000001bfd5160d552025f2f5372469c2b11dfb9c0d5a1bf069e497d447e5fccb9c38d9010000006a473044022018a4cb4f133ccdd1c54bc2dc48f4c993818894b9799c77c9b4289bb8e9680f220220285f07e71ffe79d177f7dd0a8417dbd67f909d6405da694e959d3981d83ca6d501210310eb22bc7c00ae8844b2789f53821a5b4e8bf09841b81a888fc45677d442ff96ffffffff0288130000000000001976a91491b24bf9f5288532960ac687abb035127b1d28a588ac447dfa02000000001976a91472a902c6ba239b7353e30ab5265636daf77da9bb88ac00000000');
    });

  });

});