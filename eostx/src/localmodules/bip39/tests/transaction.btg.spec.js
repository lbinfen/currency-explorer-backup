var assert = require('assert');
var BCOINJS = require('../src/bcoinsdk');

describe('BTG Transaction', function () {

  describe('#createTransaction()', function () {

    it('should calculate fee', function () {
      var coinData = {
        utxos: [{
          txId: 'af11c7d2f3f51a1572fa8ae2be3042d490cbca934c691306d8bd98d68c580cca',
          vout: 1,
          value: 8999100,
        }],
        targets: [{
          address: 'mq6w28feA2cahy4iBgqCzprzU2SnqUixqF',
          value: 1000000
        }],
        feeRate: 20
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 4500);
    });

    it('should build transaction ok', function () {
      var coinData = {
        currency: 'btgtest',
        utxos: [{
          txId: 'af11c7d2f3f51a1572fa8ae2be3042d490cbca934c691306d8bd98d68c580cca',
          vout: 1,
          value: 8999100,
          key: 'cSpZkRpUynrT7coiU8MgSbh7fyCLXfQ24y3oUbu5PCZgSYspkohu'
        }],
        targets: [{
          address: 'mq6w28feA2cahy4iBgqCzprzU2SnqUixqF',
          value: 1000000
        }],
        feeRate: 20,
        changeAddress: 'mxS2yKvw54AefwDfjMpVgHhmKZuo4M6mKr'
      };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0200000001ca0c588cd698bdd80613694c93cacb90d44230bee28afa72151af5f3d2c711af010000006a473044022075df5620717a19984efe64b765ecbe6fdbbf3947fb81db5c1803f2e01906277602200d41201eaad73ffb9ede6407f816912904dfd915c618393aa7de71e274d6428a4121027a6bbd00804aafe899a78e6b1d81e0a95351c95c5e8e3bf1ce340ef7f7f2f07bffffffff0240420f00000000001976a914692635fa9eae3ef837cacff8928e777ddd8c8acd88ace8fc7900000000001976a914b98bf678d90e1f93abaaf6e1e15606c52869262388ac00000000');
    });
    
  });

});