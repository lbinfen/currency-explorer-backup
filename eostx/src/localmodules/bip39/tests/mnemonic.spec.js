var assert = require('assert');
var HDWJS = require('../src/hdwsdk');

describe('Mnemonic', function () {

  describe('#generateMnemonic()', function () {

    it('should generate mnemonic with 15 words default', function () {
      var mnemonic = HDWJS.hdWallet.generateMnemonic();
      console.log(mnemonic);
      var words = mnemonic.data.split(',');
      assert.equal(words.length, 15);
    });

    it('should generate mnemonic with 12 words default', function () {
      var mnemonic = HDWJS.hdWallet.generateMnemonic({
        numWords: 12
      });
      console.log(mnemonic);
      var words = mnemonic.data.split(',');
      assert.equal(words.length, 12);
    });

  });

  describe('#validateMnemonic()', function () {

    it('mnemonic should be required', function () {
      var mnemonic = HDWJS.hdWallet.validateMnemonic();
      assert.equal(mnemonic.status, false);
      assert.equal(mnemonic.data, false);
      assert.equal(mnemonic.code, 2001);

      mnemonic = HDWJS.hdWallet.validateMnemonic({
        mnemonic: ""
      });
      assert.equal(mnemonic.status, false);
      assert.equal(mnemonic.data, false);
      assert.equal(mnemonic.code, 2001);
    });

    it('mnemonic should be valid', function () {
      var data = {
        mnemonic: "total,bubble,almost,soft,alter,throw,wrap,foil,soap,water,exist,mountain,fossil,hybrid,young",
      };
      var mnemonic = HDWJS.hdWallet.validateMnemonic(data);
      assert.equal(mnemonic.status, true);
      assert.equal(mnemonic.data, true);
    });

    it('mnemonic should be inalid', function () {
      var data = {
        mnemonic: "doctor,inmate,pretty,ostrich,enroll"
      };
      var mnemonic = HDWJS.hdWallet.validateMnemonic(data);
      assert.equal(mnemonic.status, false);
      assert.equal(mnemonic.data, false);
    });

  });

});