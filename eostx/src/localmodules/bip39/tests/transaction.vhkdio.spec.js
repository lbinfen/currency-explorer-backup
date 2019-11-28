var assert = require('assert');
var VHKDIOCOINJS = require('../src/vhkdiosdk');

describe('VHKDIO Transaction', function () {

  describe('#calculateFee()', function () {

    it('should calculateFee ok 1', function () {
      var tranData = {
        currency: 'vhkdiotest',
        quantity: 0.0001,
        feeRate: 0.0100,
        minFee: 0.01,
        maxFee: 100
      };
      var transferHex = VHKDIOCOINJS.vhkdiocoin.calculateFee(tranData);
      console.log(transferHex);
      assert.equal(transferHex.status, true);
      assert.equal(transferHex.data, 0.01);
    });

    it('should calculateFee ok 2', function () {
      var tranData = {
        currency: 'vhkdiotest',
        quantity: 1000.0000,
        feeRate: 0.0100,
        minFee: 0.01,
        maxFee: 100
      };
      var transferHex = VHKDIOCOINJS.vhkdiocoin.calculateFee(tranData);
      console.log(transferHex);
      assert.equal(transferHex.status, true);
      assert.equal(transferHex.data, 10);
    });

    it('should calculateFee ok 3', function () {
      var tranData = {
        currency: 'vhkdiotest',
        quantity: 1000000.0000,
        feeRate: 0.0100,
        minFee: 0.01,
        maxFee: 100
      };
      var transferHex = VHKDIOCOINJS.vhkdiocoin.calculateFee(tranData);
      console.log(transferHex);
      assert.equal(transferHex.status, true);
      assert.equal(transferHex.data, 100);
    });

    it('should calculateFee ok 4', function () {
      var tranData = {
        currency: 'vhkdiotest',
        quantity: 10000.0000,
        feeRate: 0.0003,
        minFee: 0.01,
        maxFee: 100
      };
      var transferHex = VHKDIOCOINJS.vhkdiocoin.calculateFee(tranData);
      console.log(transferHex);
      assert.equal(transferHex.status, true);
      assert.equal(transferHex.data, 3);
    });

    it('should calculateFee ok 5', function () {
      var tranData = {
        currency: 'vhkdiotest',
        quantity: 0,
        feeRate: 0.0003,
        minFee: 0.01,
        maxFee: 100
      };
      var transferHex = VHKDIOCOINJS.vhkdiocoin.calculateFee(tranData);
      console.log(transferHex);
      assert.equal(transferHex.status, true);
      assert.equal(transferHex.data, 0);
    });
  });

  describe('#createTransfer()', function () {
    it('should create transfer transaction ok 1', function () {
      var tranData = {
        currency: 'vhkdiotest',
        from: "vgpay12345aa",
        to: "dzz",
        quantity: 0.0001,
        fee: 0.0100,
        memo: "transfer from jssdk!"
      };
      var transferHex = VHKDIOCOINJS.vhkdiocoin.createTransfer(tranData);
      console.log(transferHex);
      assert.equal(transferHex.status, true);
      assert.equal(JSON.stringify(transferHex.data), '{"account":"eosio.token","authorization":[{"actor":"vgpay12345aa","permission":"active"}],"name":"transferex","data":{"from":"vgpay12345aa","to":"dzz","quantity":"0.0001 VHKD","fee":"0.0100 VHKD","memo":"transfer from jssdk!"}}');
    });

  });

  describe('#signTransaction()', function () {

    it('should sign transaction ok 1', function () {
      var tranData = {
        currency: 'vhkdiotest',
        key: '5KWX574FXK1JEas55mtwgAyEunF6ETCPet1hk7uacb5TGodp4o9',
        serializedTransaction: '70ed095df6ffb8b69b06000000000100a6823403ea3055004057572d3ccdcd01604c2143046f2adb00000000a8ed323245604c2143046f2adb000000000000fe4f01000000000000000456484b4400000064000000000000000456484b44000000147472616e736665722066726f6d206a7373646b2100'
      };
      var txHex = VHKDIOCOINJS.vhkdiocoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(JSON.stringify(txHex.data), '{"signatures":["SIG_K1_K6zsSfcrgNnSY4hxDffbaF7gjL9y979fbEx16b7FG637SG5qVRkmhHmkWrNi48UFHrJzTS9AVU82X63Gdifw41X4YAf2mb"],"compression":0,"packed_context_free_data":"","packed_trx":"70ed095df6ffb8b69b06000000000100a6823403ea3055004057572d3ccdcd01604c2143046f2adb00000000a8ed323245604c2143046f2adb000000000000fe4f01000000000000000456484b4400000064000000000000000456484b44000000147472616e736665722066726f6d206a7373646b2100"}');
    });

  });

});