var assert = require('assert');
var BCOINJS = require('../src/bcoinsdk');

describe('VHKD Transaction', function () {

  describe('#createTransaction()', function () {

    it('should calculate fee', function () {
      var coinData = {
        utxos: [{
          txId: '74a4d839f2197587f21285b058ca2aebfaa0b8f0b49a5655652a7a2ec3ab8ed7',
          vout: 1,
          value: 1000000000000,
        }],
        targets: [{
          address: 'VTD8CCwwtzMLdVVa7oJdHXgqf1bewbpBh3',
          value: 100000000
        }],
        feeRate: 0.0003,
        currency: 'vhkd'
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 30000);
    });

    it('should calculate fee2', function () {
      var coinData = {
        utxos: [{
          txId: '965c404cb388b11760871cb63299d7673cf651762a422ba6107412afac988fd8',
          vout: 1,
          value: 12000000000,
        }],
        targets: [{
          address: '1EFHGs7PMGpdzLxn56o6oUV4K9z9YBZc6Y',
          value: 100000000
        }],
        feeRate: 0.0003,
        currency: 'vhkd'
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 30000);
    });

    it('should calculate fee3', function () {
      var coinData = {
        utxos: [{
          txId: '7771733bfc837f279e4f0e0ef4440afd075d56e30814443672403248596a2209',
          vout: 0,
          value: 10000000000,
        }],
        targets: [{
          address: '1Q4uNEvLTqxQEAbbpEDVBvF6hH7VTkxFht',
          value: 10000000000
        }],
        feeRate: 0.0003,
        currency: 'vhkd'
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 3000000);
    });

    it('should calculate fee use min fee', function () {
      var coinData = {
        utxos: [{
          txId: '74a4d839f2197587f21285b058ca2aebfaa0b8f0b49a5655652a7a2ec3ab8ed7',
          vout: 1,
          value: 1000000000000,
        }],
        targets: [{
          address: 'VTD8CCwwtzMLdVVa7oJdHXgqf1bewbpBh3',
          value: 100000
        }],
        feeRate: 0.0003,
        currency: 'vhkd',
        minFee: 30000
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 30000);
    });

    it('should calculate fee use max fee', function () {
      var coinData = {
        utxos: [{
          txId: '74a4d839f2197587f21285b058ca2aebfaa0b8f0b49a5655652a7a2ec3ab8ed7',
          vout: 1,
          value: 100000000000000000000,
        }],
        targets: [{
          address: 'VTD8CCwwtzMLdVVa7oJdHXgqf1bewbpBh3',
          value: 100000000000000000000
        }],
        feeRate: 0.0003,
        currency: 'vhkd',
        maxFee: 100000000000
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 100000000000);
    });

    it('should build transaction ok 1', function () {
      var coinData = {
        currency: 'vhkd',
        utxos: [{
          txId: 'cfc5f830a3443ebd85cfc8a004d74be70cb45b5fc8dd781a7933f7a54c6133e7',
          vout: 0,
          value: 1000000000,
          key: 'L3qj73DQzaWnBy2RmnvXDUkq3tUjAWJ2mM3XZzPdbN7UXW444fGS'
        }],
        targets: [{
          address: 'VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC',
          value: 100000000
        }],
        feeRate: 0.0003,
        changeAddress: 'VTD8CCwwtzMLdVVa7oJdHXgqf1bewbpBh3'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0100000001e733614ca5f733791a78ddc85f5bb40ce74bd704a0c8cf85bd3e44a330f8c5cf000000006a47304402207c9863d395e5c68ff768d76ef9cacd1f65655b05c0450608410b5c6ac8fa333c02205c1a83da0f2094b3344a2f677c4cda7851304f60ede51e3d405208987c6dd12e0121039409b25aeda4686f8e94c0eacb90bd6c516ca0967f737d2b7b773bc53075e784ffffffff0200e1f505000000001976a914a83f766e285dd3494b03361a7a358e01df7972b288acd073a435000000001976a914b58a8a1391d9c4fd7b74e800541477eb0021d19788ac00000000');
    });

    it('should build transaction ok 2', function () {
      var coinData = {
        currency: 'vhkd',
        utxos: [{
          txId: '321be957fd57b6b5194f35686a6a760f444065c5dba4de16db2a1da8c97fbc60',
          vout: 1,
          value: 123400000000,
          key: 'Ky4j9NukFVWzmo2Z4GXhPmbd9cfkLCUn9uvok1LmcWq21KdxLuPo'
        },{
          txId: 'd9eeb7fcfe49e7a5cbf6daeaf6e303dde0179ecdeeac34ca521f800dba5e0914',
          vout: 1,
          value: 710849032353190400,
          key: 'L15B5jyqpWRzCZH2LkGT4S9YPnYGmyXFXjYnSjPN8z3j58gDsBH7'
        }],
        targets: [{
          address: 'VTHkm491W3uvvSnYhQG5RkWSW9dnbr11sQ',
          value: 10000000000
        }],
        feeRate: 3.0E-4,
        maxFee: 100000000000,
        minFee: 30000,
        changeAddress: 'VGuVZ8LNoW6idXGkDS7dAVB2Ftawqy5yzz'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '010000000114095eba0d801f52ca34aceecd9e17e0dd03e3f6eadaf6cba5e749fefcb7eed9010000006a473044022058d9610fc36460108b9a0a8f8b7a2ebb59cad995d34d4d5b21f90e600b92b1b502204600089bba277a04505cc0477f8377826dbb4159de3a239e99b85af87a5b890d0121020bf8a04fd0338960bb2bb9794e6c5f89e7c78c26c55aa8fbdc57f20380d46f2bffffffff0200e40b54020000001976a914b66aba2d8acc077deda90f9ea284b88f22823e1188ac00e71d6a6b71dd091976a9144483a00ea5ff1fbbfc362f258b7df73d11d1e79488ac00000000');
    });

    it('should build transaction ok with fully transfer', function () {
      var coinData = {
        currency: 'vhkd',
        utxos: [{
          txId: 'fa9cfb59b10e24b2bc339f2e67fd125f76d1695ad5ec2f994ccee34fdb631af6',
          vout: 1,
          value: 899970000,
          key: 'L3qj73DQzaWnBy2RmnvXDUkq3tUjAWJ2mM3XZzPdbN7UXW444fGS'
        }],
        targets: [{
          address: 'VRzqUHk3dStSrk49DA22tH4bJfkGYR5dHC',
          value: 899970000
        }],
        feeRate: 0.0003,
        changeAddress: 'VTD8CCwwtzMLdVVa7oJdHXgqf1bewbpBh3'
      };
      let fee = BCOINJS.bcoin.calculateFee(coinData);
      assert.equal(fee.status, true);
      coinData.targets[0].value = coinData.targets[0].value - fee.data;
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0100000001f61a63db4fe3ce4c992fecd55a69d1765f12fd672e9f33bcb2240eb159fb9cfa010000006a47304402202925b48abf930c3c31b72232f31713b5339c86fad7ca883fba0a0028a02de6a60220364cdea9512bb082ad27f5819ea1e94bfe952339e728af22ca6b15037fac6dcc0121039409b25aeda4686f8e94c0eacb90bd6c516ca0967f737d2b7b773bc53075e784ffffffff012955a035000000001976a914a83f766e285dd3494b03361a7a358e01df7972b288ac00000000');
    });

    it('should build transaction fail', function () {
      var coinData = {
        currency: 'vhkd',
        utxos: [{
          txId: '7771733bfc837f279e4f0e0ef4440afd075d56e30814443672403248596a2209',
          vout: 0,
          value: 10000000000,
          key: 'L4pCfRBpZYn3eozHsdn6NQR2Jc2bU4jVXwoLAfbTnjvZakumqgZg'
        }],
        targets: [{
          address: '1Q4uNEvLTqxQEAbbpEDVBvF6hH7VTkxFht',
          value: 10000000000
        }],
        feeRate: 10,
        changeAddress: '1BTGVwzCPjhuGSKNJrDwJKzYVAc2UNjzbW'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      assert.equal(txHex.status, false);
      assert.equal(txHex.code, 2015);
    });

  });



});