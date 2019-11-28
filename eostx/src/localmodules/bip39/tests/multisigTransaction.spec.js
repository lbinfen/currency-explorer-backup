var assert = require('assert');
var BCOINJS = require('../src/bcoinsdk');
var ECOINJS = require('../src/ecoinsdk');

describe('BTC MultiSig Transaction', function () {

  describe('#signMultiSigTransaction()', function () {

    it('should sign multisig transaction ok 2/3 the second sign 1', function () {
      var txData = {
        currency: 'btc',
        redeemScript: '522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853ae',
        txHex: '0200000001e00be8ec14f5fdf3c12494600b92be1e172c096f55eb4118343bc8ca85a550a801000000b500483045022100c131983b60bd47be9f3bda098e1b63390023fb520ac3cd4b6dce9940ea3266f8022009f3050fac5c15fa03ce2bb5b8b6961c2e58d3a3b74bda02972234d674c04ab4014c69522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853aeffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000b6b1b0000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000',
        key: 'KxLd81HhAAMzFTPtrYQKXfhBXZWkhenTK8JxkAMnsGZKgqmWDk2z'
      };
      var txHex = BCOINJS.bcoin.signMultisigTransaction(txData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0200000001e00be8ec14f5fdf3c12494600b92be1e172c096f55eb4118343bc8ca85a550a801000000fdfe0000483045022100af3d8ec2f89aeaf02dfe85bb48a8a8579c392a65b55ff0b2194a0afa82d559aa02204374f3ae477c908efb839d5003aee212928121aaa497e1418cc52bba953ab7d801483045022100c131983b60bd47be9f3bda098e1b63390023fb520ac3cd4b6dce9940ea3266f8022009f3050fac5c15fa03ce2bb5b8b6961c2e58d3a3b74bda02972234d674c04ab4014c69522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853aeffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000b6b1b0000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000');
    });


    it('should sign multisig transaction ok 2/3 the second sign 2', function () {
      var txData = {
        currency: 'btc',
        utxos: [
          {
            vout: 0,
            redeemScript: '522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853ae',
          }
        ],
        txHex: '0200000001e00be8ec14f5fdf3c12494600b92be1e172c096f55eb4118343bc8ca85a550a801000000b500483045022100c131983b60bd47be9f3bda098e1b63390023fb520ac3cd4b6dce9940ea3266f8022009f3050fac5c15fa03ce2bb5b8b6961c2e58d3a3b74bda02972234d674c04ab4014c69522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853aeffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000b6b1b0000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000',
        key: 'KxLd81HhAAMzFTPtrYQKXfhBXZWkhenTK8JxkAMnsGZKgqmWDk2z'
      };
      var txHex = BCOINJS.bcoin.signMultisigTransaction(txData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0200000001e00be8ec14f5fdf3c12494600b92be1e172c096f55eb4118343bc8ca85a550a801000000fdfe0000483045022100af3d8ec2f89aeaf02dfe85bb48a8a8579c392a65b55ff0b2194a0afa82d559aa02204374f3ae477c908efb839d5003aee212928121aaa497e1418cc52bba953ab7d801483045022100c131983b60bd47be9f3bda098e1b63390023fb520ac3cd4b6dce9940ea3266f8022009f3050fac5c15fa03ce2bb5b8b6961c2e58d3a3b74bda02972234d674c04ab4014c69522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853aeffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000b6b1b0000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000');
    });

    
    it('should sign multisig transaction ok 2/3 the second sign 3', function () {
      var txData = {
        currency: 'btc',
        utxos: [
          {
            vout: 0,
            redeemScript: '5321020f2eab7c92cf9929ed604f84f1beabc4bfb610f0bb2ce14c5e8db2b840e9c9142102600893fa4c64957082b66b57ded02756af8000d0d796ead6eb868e42b701d45221028dc5ba19d4cf37e7fed23b7c16f71081d4847515b2db333a9fd2f7f84626ffbd21028b7ff819e57eb163fc2fdf030fe42f28c3e09a0cf8874b1a7c4df8c74f230244210254d76785dde44d332ece32559256ed50fe5456fb8a484f8b807843002525880855ae',
          }
        ],
        txHex: '020000000170249ff97e3961e76b779f81adb2f3e438c449767ee46153efd66bd70f198e930000000000ffffffff02ce61aecee800000017a914a3e39e26c7c51c7476eb2cd0effddb0d12e113908700e1f505000000001976a914aa40f87a24f67b27392ebeda04d9a052d758f13a88ac00000000',
        key: 'L1TLP8zu2MtTD15PT5i67cXEtcKHNBES8XhimW8CLhk9qzQTaXS2'
      };
      var txHex = BCOINJS.bcoin.signMultisigTransaction(txData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '020000000170249ff97e3961e76b779f81adb2f3e438c449767ee46153efd66bd70f198e9300000000f900483045022100b4c336197f8e227019d10818d91c8699cd614ab17addcac3a35126f7329ee37102207fea906c73a64e34b201e3b995c0e1d93dcb7a898a210ca743687aadd446742e014cad5321020f2eab7c92cf9929ed604f84f1beabc4bfb610f0bb2ce14c5e8db2b840e9c9142102600893fa4c64957082b66b57ded02756af8000d0d796ead6eb868e42b701d45221028dc5ba19d4cf37e7fed23b7c16f71081d4847515b2db333a9fd2f7f84626ffbd21028b7ff819e57eb163fc2fdf030fe42f28c3e09a0cf8874b1a7c4df8c74f230244210254d76785dde44d332ece32559256ed50fe5456fb8a484f8b807843002525880855aeffffffff02ce61aecee800000017a914a3e39e26c7c51c7476eb2cd0effddb0d12e113908700e1f505000000001976a914aa40f87a24f67b27392ebeda04d9a052d758f13a88ac00000000');
    });
    

    it('should sign multisig transaction ok 2/2 the first sign 1', function () {
      var txData = {
        currency: 'btc',
        redeemScript: '522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853ae',
        txHex: '0200000001bbf1c6dd9a9c0afc9e969d200dbed9e815d6b7cda446bfb31f86cd631983cf5c0100000000ffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000237580000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000',
        key: 'KxLd81HhAAMzFTPtrYQKXfhBXZWkhenTK8JxkAMnsGZKgqmWDk2z'
      };
      var txHex = BCOINJS.bcoin.signMultisigTransaction(txData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0200000001bbf1c6dd9a9c0afc9e969d200dbed9e815d6b7cda446bfb31f86cd631983cf5c01000000b500483045022100dda13a6d1be18b122f6e5a76020ee7ef7fa3f71e42b9ddec471af729dbe663f4022031b55fa32c8343ece1fd3e61fbabd16375c0aa565a4a4d8dc3a615807bbce05d014c69522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853aeffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000237580000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000');
    });

    it('should sign multisig transaction ok 2/2 the first sign 2', function () {
      var txData = {
        currency: 'btc',
        utxos: [
          {
            vout: 0,
            redeemScript: '522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853ae',
          }
        ],
        txHex: '0200000001bbf1c6dd9a9c0afc9e969d200dbed9e815d6b7cda446bfb31f86cd631983cf5c0100000000ffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000237580000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000',
        key: 'KxLd81HhAAMzFTPtrYQKXfhBXZWkhenTK8JxkAMnsGZKgqmWDk2z'
      };
      var txHex = BCOINJS.bcoin.signMultisigTransaction(txData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0200000001bbf1c6dd9a9c0afc9e969d200dbed9e815d6b7cda446bfb31f86cd631983cf5c01000000b500483045022100dda13a6d1be18b122f6e5a76020ee7ef7fa3f71e42b9ddec471af729dbe663f4022031b55fa32c8343ece1fd3e61fbabd16375c0aa565a4a4d8dc3a615807bbce05d014c69522102ba7d8066bce9a34e1263a1deb8af98993928f85784f45ee75fd1b8eca2929cb4210246eeeef5ef11b29f9f36d77d61732e5fc9b2eda189f592c5eb373463ef83a50c21039154d52152b6e88e46310ebaf71a9dcb53899a46c7fd24c4d804e3dd370e5c1853aeffffffff0280969800000000001976a9143e4c2ffde7afe2834013c082a77562c2863d5c7988ac000237580000000017a91443be3386d48bc67b6b56c0ac0edc8eeb9a68ebcb8700000000');
    });

    it('should sign multisig transaction ok from app', function () {
      var txData = {
        currency: 'btctest',
        utxos: [
          {
            vout: 0,
            redeemScript: '5221033b13720c1d492900533ccc765d97827e578105b3eccba20bfb0350e9012c247321022106eca8b97b58f653ec6ac3b0f71f68583fd6d825cb0350b1ac1b55474872bb2103f957ce50b4bc2b7ae5313a0aa77d2cc95a9625f8dd5ae73ab869c0267a6dcb0553ae',
          }
        ],
        txHex: '020000000177df5879415db73b9f918d84da66bda282411fd89d42b0cd4977020b06454a030000000000ffffffff02a08601000000000017a91433bbbe9ebba314d8bb9fd1b50f2359154487f3ba87102700000000000017a9146ad328a68c869b7d418461de4fc2a5f153aa7fd68700000000',
        key: 'cNTyY1iUTNW8qYwHvCKkUDbh1hpJRC9CDQUVz7bP2AxPMYrnDYvr'
      };
      var txHex = BCOINJS.bcoin.signMultisigTransaction(txData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '020000000177df5879415db73b9f918d84da66bda282411fd89d42b0cd4977020b06454a0300000000b50048304502210098574723d6f9c0cf358a40e9bec2d8759857cf2a5e7106331cb564de44ca34a30220337cebeddb4a976d5e99c1504c3fcede6dc91874a79b94da757b0d68ae073962014c695221033b13720c1d492900533ccc765d97827e578105b3eccba20bfb0350e9012c247321022106eca8b97b58f653ec6ac3b0f71f68583fd6d825cb0350b1ac1b55474872bb2103f957ce50b4bc2b7ae5313a0aa77d2cc95a9625f8dd5ae73ab869c0267a6dcb0553aeffffffff02a08601000000000017a91433bbbe9ebba314d8bb9fd1b50f2359154487f3ba87102700000000000017a9146ad328a68c869b7d418461de4fc2a5f153aa7fd68700000000');
    });
  });
});

describe('ETH MultiSig Transaction', function () {

  describe('#signMultiSigTransaction()', function () {

    it('should sign multisig transaction ok 2/3 the second sign', function () {
      var txData = {
        hash: '0x0ef3b7b66d682fe7d50c5b4dc721c89c083b64aced74d1a9857f7443241dd840',
        key: '2309cdb18048a6c6ddf16028c44441f5949151c5cd5c3b4009297a63c773f415'
      };
      var txHex = ECOINJS.ecoin.signMultisigTransaction(txData);
      console.log(txHex);
      assert.equal(txHex.status, true);
      assert.equal(txHex.data, '0xf897eb80a246902904059eda59cc6e0d725cd0630d51603b203b09f36d76dee7239e63fdecd8efdd30b8fbc554b2424238990ddf3c681d04a348e0a96fb4969f1b');
    });
  });
});