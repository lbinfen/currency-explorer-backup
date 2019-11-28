var assert = require('assert');
var BCOINJS = require('../src/bcoinsdk');
var ECOINJS = require('../src/ecoinsdk');

describe('ETH Transaction', function () {

  describe('#Transfer FOR ETH', function () {

    //FROM:0xC7ddA9aB6A01377e6a6437288BB09db793bD4139
    //TO:0x958649BD0830f2F9f74dFD07b50F05160E21D8B3
    it('should build transaction ok 1', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0x958649BD0830f2F9f74dFD07b50F05160E21D8B3',
        value: '0.5994',
        gas: 21000,
        gasPrice: '0.000001',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        nonce: 55
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf86b01843b9aca0082520894958649bd0830f2f9f74dfd07b50f05160e21d8b388016345785d8a0000802ba08e738c9376ded6eb76d0951af44932d38335aeb6ed3faf49280bc508f323cecba04fbd430d5b67f0c2b80a9872133804e67346caaa28cdada97cf0444b195d717e');
    });
    
    it('should build transaction ok 2', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0x958649BD0830f2F9f74dFD07b50F05160E21D8B3',
        value: '0.1',
        gas: 21000,
        gasPrice: '1',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        nonce: 20
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf86b01843b9aca0082520894958649bd0830f2f9f74dfd07b50f05160e21d8b388016345785d8a0000802ba08e738c9376ded6eb76d0951af44932d38335aeb6ed3faf49280bc508f323cecba04fbd430d5b67f0c2b80a9872133804e67346caaa28cdada97cf0444b195d717e');
    });

    it('should build transaction ok 3', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0x958649BD0830f2F9f74dFD07b50F05160E21D8B3',
        value: '0.1',
        gas: 21000,
        gasPrice: '1',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        nonce: 9
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf86b01843b9aca0082520894958649bd0830f2f9f74dfd07b50f05160e21d8b388016345785d8a0000802ba08e738c9376ded6eb76d0951af44932d38335aeb6ed3faf49280bc508f323cecba04fbd430d5b67f0c2b80a9872133804e67346caaa28cdada97cf0444b195d717e');
    });
  });

  describe('#Transfer FOR ETH ERC20 TOKEN', function () {

    //FROM:0xC7ddA9aB6A01377e6a6437288BB09db793bD4139
    //TO:0x958649BD0830f2F9f74dFD07b50F05160E21D8B3
    it('should build transaction ok with erc20 LGZ token', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0xc1bc542aa3e5f2e5c73dd859bd3e7d712452b7d5',
        value: '11',
        gas: 67586,
        gasPrice: '420',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        tokenContract: '0xf30bd271c4bdd6b1280a8f4882752e7ea05b3d7c',
        tokenDecimals: 18,
        nonce: 54
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf8a806843b9aca0082e0f294f30bd271c4bdd6b1280a8f4882752e7ea05b3d7c80b844a9059cbb000000000000000000000000958649bd0830f2f9f74dfd07b50f05160e21d8b30000000000000000000000000000000000000000000000000de0b6b3a76400002ba045bc785045ac529de97f3db5dc27a57df1cf6c1838c3371c170c3ad45189966ca04c615f33b8edb4836cafa9acc4e589c19949fd59ad820bc8a34c2a59bc6c552b');
    });

    //EVY: 0x9a55179bddc1bd95c6925a6513df58978f881e7f
    //FROM:0xC7ddA9aB6A01377e6a6437288BB09db793bD4139
    //TO:0x958649BD0830f2F9f74dFD07b50F05160E21D8B3
    it('should build transaction ok with erc20 EVY token', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0xc1bc542aa3e5f2e5c73dd859bd3e7d712452b7d5',
        value: '900000',
        gas: 67586,
        gasPrice: '420',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        tokenContract: '0x9a55179bddc1bd95c6925a6513df58978f881e7f',
        tokenDecimals: 12,
        nonce: 56
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf8a806843b9aca0082e0f294f30bd271c4bdd6b1280a8f4882752e7ea05b3d7c80b844a9059cbb000000000000000000000000958649bd0830f2f9f74dfd07b50f05160e21d8b30000000000000000000000000000000000000000000000000de0b6b3a76400002ba045bc785045ac529de97f3db5dc27a57df1cf6c1838c3371c170c3ad45189966ca04c615f33b8edb4836cafa9acc4e589c19949fd59ad820bc8a34c2a59bc6c552b');
    });

    //TRX: 0x4f28210654097413179427b097b0ac49dd5978a4
    //FROM:0xC7ddA9aB6A01377e6a6437288BB09db793bD4139
    //TO:0x958649BD0830f2F9f74dFD07b50F05160E21D8B3
    it('should build transaction ok with erc20 TRX token', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0xc1bc542aa3e5f2e5c73dd859bd3e7d712452b7d5',
        value: '90000000',
        gas: 67586,
        gasPrice: '420',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        tokenContract: '0x4f28210654097413179427b097b0ac49dd5978a4',
        tokenDecimals: 6,
        nonce: 57
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf8a806843b9aca0082e0f294f30bd271c4bdd6b1280a8f4882752e7ea05b3d7c80b844a9059cbb000000000000000000000000958649bd0830f2f9f74dfd07b50f05160e21d8b30000000000000000000000000000000000000000000000000de0b6b3a76400002ba045bc785045ac529de97f3db5dc27a57df1cf6c1838c3371c170c3ad45189966ca04c615f33b8edb4836cafa9acc4e589c19949fd59ad820bc8a34c2a59bc6c552b');
    });

    //AMA: 0x9e3f44af805e1d11b170bdd6eeb39e7499da86cd
    //FROM:0xC7ddA9aB6A01377e6a6437288BB09db793bD4139
    //TO:0x958649BD0830f2F9f74dFD07b50F05160E21D8B3
    it('should build transaction ok with erc20 AMA token', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0xc1bc542aa3e5f2e5c73dd859bd3e7d712452b7d5',
        value: '9000000',
        gas: 67586,
        gasPrice: '420',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        tokenContract: '0x9e3f44af805e1d11b170bdd6eeb39e7499da86cd',
        tokenDecimals: 6,
        nonce: 58
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf8a806843b9aca0082e0f294f30bd271c4bdd6b1280a8f4882752e7ea05b3d7c80b844a9059cbb000000000000000000000000958649bd0830f2f9f74dfd07b50f05160e21d8b30000000000000000000000000000000000000000000000000de0b6b3a76400002ba045bc785045ac529de97f3db5dc27a57df1cf6c1838c3371c170c3ad45189966ca04c615f33b8edb4836cafa9acc4e589c19949fd59ad820bc8a34c2a59bc6c552b');
    });

    //POLY: 0x591af38175fd27b696cd99a53cc97c6f3322cb00
    //FROM:0xC7ddA9aB6A01377e6a6437288BB09db793bD4139
    //TO:0x958649BD0830f2F9f74dFD07b50F05160E21D8B3
    it('should build transaction ok with erc20 POLY token', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0xc1bc542aa3e5f2e5c73dd859bd3e7d712452b7d5',
        value: '900000',
        gas: 67586,
        gasPrice: '420',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        tokenContract: '0x591af38175fd27b696cd99a53cc97c6f3322cb00',
        tokenDecimals: 18,
        nonce: 59
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf8a806843b9aca0082e0f294f30bd271c4bdd6b1280a8f4882752e7ea05b3d7c80b844a9059cbb000000000000000000000000958649bd0830f2f9f74dfd07b50f05160e21d8b30000000000000000000000000000000000000000000000000de0b6b3a76400002ba045bc785045ac529de97f3db5dc27a57df1cf6c1838c3371c170c3ad45189966ca04c615f33b8edb4836cafa9acc4e589c19949fd59ad820bc8a34c2a59bc6c552b');
    });

    //EURS: 0x144ce6746705e6ace15e8581ec347bfebdbcd565
    //FROM:0xC7ddA9aB6A01377e6a6437288BB09db793bD4139
    //TO:0x958649BD0830f2F9f74dFD07b50F05160E21D8B3
    it('should build transaction ok with erc20 EURS token', function () {
      let tranData = {
        currency: 'ethtest',
        to: '0xc1bc542aa3e5f2e5c73dd859bd3e7d712452b7d5',
        value: '90000',
        gas: 67586,
        gasPrice: '420',
        privateKey: '0xf18780d0e2d67cd2c6f04b0e75e643a0d5330ff2d19f51d934b4540835e760ca',
        tokenContract: '0x144ce6746705e6ace15e8581ec347bfebdbcd565',
        tokenDecimals: 2,
        nonce: 60
      };
      var txHex = ECOINJS.ecoin.signTransaction(tranData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      //assert.equal(txHex.data, '0xf8a806843b9aca0082e0f294f30bd271c4bdd6b1280a8f4882752e7ea05b3d7c80b844a9059cbb000000000000000000000000958649bd0830f2f9f74dfd07b50f05160e21d8b30000000000000000000000000000000000000000000000000de0b6b3a76400002ba045bc785045ac529de97f3db5dc27a57df1cf6c1838c3371c170c3ad45189966ca04c615f33b8edb4836cafa9acc4e589c19949fd59ad820bc8a34c2a59bc6c552b');
    });

  });

});

describe('BTC Transaction', function () {

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
        feeRate: 4
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 900);
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
        feeRate: 10
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 1910);
    });

    it('should calculate fee4', function () {
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
        feeRate: 4,
        minFee: 5000,
        maxFee: 10000000
      };
      var fee = BCOINJS.bcoin.calculateFee(coinData);
      console.log(fee);
      assert.equal(fee.status, true);
      assert.equal(fee.data, 7650);
    });

    //address:1LhrW23unXwm6qMgHMBEjUTTZfw4DBtfYw
    //pubkey:020a37b27c2e4ae257362d4ea17918069c494894f8488ffca1787e0af0e77a0448
    //prikey:L5P9ZJABF6wAerGi6MV91x6naDdPCpkAhUgbT7qei4gUuotvT7jU

    it('should build transaction ok', function () {
      var coinData = {
        currency: 'btc',
        utxos: [{
          txId: 'ec132026f941f51e445387bd40a6ab3c05e5fd1fb517081cb18de80ca67fba90',
          vout: 1,
          value: 9898650,
          key: 'L5P9ZJABF6wAerGi6MV91x6naDdPCpkAhUgbT7qei4gUuotvT7jU'
        }],
        targets: [{
          address: '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm',
          value: 100000
        }],
        feeRate: 4,
        changeAddress: '1LhrW23unXwm6qMgHMBEjUTTZfw4DBtfYw',
        minFee: 5000,
        maxFee: 10000000
     };
      var txHex = BCOINJS.bcoin.buildTransaction(coinData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '010000000190ba7fa60ce88db11c0817b51ffde5053caba640bd8753441ef541f9262013ec010000006a4730440220586090173897c7a422483fa4ae53235965260c5785e04a4d49b70d21cacded4502200b8067a586928566c41a2be266f19463999aa37e2f5b144c4d8afbf15d5d05dd0121020a37b27c2e4ae257362d4ea17918069c494894f8488ffca1787e0af0e77a0448ffffffff02a0860100000000001976a91491b24bf9f5288532960ac687abb035127b1d28a588ac18669500000000001976a914d8245961706cf39901e76c92acab5b0b5b6e51ab88ac00000000');
    });

    it('should build transaction ok with fully transfer', function () {
      var coinData = {
        currency: 'btc',
        utxos: [{
          txId: 'aca2cea1c802892130677f1fa6a5137623dcde119f54abfb1f73563fbcf68b40',
          vout: 0,
          value: 10599900000,
          key: 'Ky2RubdDcJKeoMv9gERjwwKKXv5bandtk9paDwKYhSbpJkjh3DoW'
        }],
        targets: [{
          address: '1MXjrJRbSCDM6eDGp3zLeV2hyLck1VLMnA',
          value: 10599900000
        }],
        feeRate: 18,
        changeAddress: '1LtEVW3fsqTPE4TqGFDCqWy13UcS1dZgse'
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

    it('should build transaction fail', function () {
      var coinData = {
        currency: 'btctest',
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