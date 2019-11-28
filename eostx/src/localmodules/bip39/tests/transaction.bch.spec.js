var assert = require('assert');
var BCOINJS = require('../src/bcoinsdk');

describe('BCHABC Transaction', function () {

  describe('#createTransaction()', function () {

    it('should calculate fee', function () {
      var coinData = {
        utxos: [{
          txId: '07ac4606d0a18e7a77b19def98c5c6f29a437d8cf7791575608cede706ad4fce',
          vout: 1,
          value: 20000000,
        }],
        targets: [{
          address: '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm',
          value: 5000
        }],
        feeRate: 4
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 900);
    });

    it('should build transaction ok', function () {
      var coinData = {
        currency: 'bchabctest',
        utxos: [{
          txId: 'e1fb56972c0968a9ccddee8c5389b14868ff2e817b7431864142d1a8a9216650',
          vout: 1,
          value: 10000000,
          key: 'cQvZvKqGnEonzkoxTFmNwQHsSuQYNwarDNGV4VEF8rdeY1FTqkf9'
        }],
        targets: [{
          address: 'bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn',
          value: 9000000
        }],
        feeRate: 4,
        changeAddress: 'mhMJiCi8iL6xa8Sub2BMqkDC3ZfvP3yBDh'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0200000001506621a9a8d142418631747b812eff6848b189538ceeddcca968092c9756fbe1010000006a473044022000c5d2ab7d253b4e2ef263e25046efe65d3bd016d0c057cec894e12e52b1d6ea02207499affe2f6e681cbefa8293fbce9e279f63c67c0e7908ab469c177081c703b9412102e1572c55be1e3a3e1fd5e2b1a4b635bc7693ed244f4252a729e2e0282cec1e4cffffffff0240548900000000001976a914692635fa9eae3ef837cacff8928e777ddd8c8acd88acbc3e0f00000000001976a914141d22797590b7566ca29b1cd55d8c15543421bc88ac00000000');
    });

    it('should build transaction ok 2', function () {
      var coinData = {
        currency: 'bchabctest',
        utxos: [{
          txId: '48d8e98f791037141e6fcd16455b5f9064a77d0230ae95d15b53f4d4c1a6de4e',
          vout: 0,
          value: 9000000,
          key: 'cUjRqT53NaQ4NQWWpAetvjwyBk1iyfrMr85oLhodVnpV2ThCY8i9'
        }],
        targets: [{
          address: 'mhMJiCi8iL6xa8Sub2BMqkDC3ZfvP3yBDh',
          value: 90000
        }],
        feeRate: 4,
        changeAddress: 'bchtest:qp5jvd06n6hra7phet8l3y5wwa7amry2e5a4clldfn'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '02000000014edea6c1d4f4535bd195ae30027da764905f5b4516cd6f1e143710798fe9d848000000006b483045022100b914306236c5bbf161b34eb0a2dd309f0f0b9e4d1c4844aa53240467cf1ceb0e02202f96785fb8ee289486ec664fe2e592702fe9667e83f73c9027f6e8dcef1a8ef141210296fb88425e1fc06456bddb5db9af0639b46ecea4a7ace655164a7128dd546b26ffffffff02905f0100000000001976a914141d22797590b7566ca29b1cd55d8c15543421bc88ac2cf18700000000001976a914692635fa9eae3ef837cacff8928e777ddd8c8acd88ac00000000');
    });
    
  });

});