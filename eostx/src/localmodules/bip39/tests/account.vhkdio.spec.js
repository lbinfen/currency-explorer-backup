var assert = require('assert');
var VHKDIOJS = require('../src/vhkdiosdk');

describe('VHKDIO Account', function () {

  describe('#randomAccountName()', function () {

    it('should use prefix', function () {
      var accountName = VHKDIOJS.vhkdiocoin.randomAccountName({ 'prefix': 'vgpay', 't': 7});
      console.log(accountName);
      assert.equal(accountName.status, true);
      assert.equal(accountName.data.substr(0, 5), 'vgpay');
    });

  });

});