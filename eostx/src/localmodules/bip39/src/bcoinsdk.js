const CoinData = require("./coindata");
const bitcoin = require('bitcoinforksjs-lib')
let coinSelect = require('coinselect')
let utils = require('coinselect/utils')
const bchaddr = require('bchaddrjs');

class BCoin {
  constructor() {
    this.coinSelectlist = {};
    this.coinSelectlist['btc'] = coinSelect.coinSelect;
    this.coinSelectlist['btctest'] = coinSelect.coinSelect;
    this.coinSelectlist['vhkd'] = coinSelect.percentFeeCoinSelect;
    this.coinSelectlist['vhkdtest'] = coinSelect.percentFeeCoinSelect;
    this.coinSelectlist['btl'] = coinSelect.fixedFeeCoinSelect;
    this.coinSelectlist['btltest'] = coinSelect.fixedFeeCoinSelect;
  }

  isBCH(currency) {
    return currency == 'bchabc' || currency == 'bchabctest';
  }

  isBTG(currency) {
    return currency == 'btg' || currency == 'btgtest';
  }

  getCoinSelect(currency) {
    if (!currency) {
      currency = 'btc';
    }

    if (this.coinSelectlist[currency]) {
      return this.coinSelectlist[currency];
    }

    return coinSelect.coinSelect;
  }

  result(status, data, code) {
    return {
      status: status, //bool
      data: data, //any
      code: code //int
    };
  }

  isEmpty(value) {
    return value == undefined || value == '';
  }

  calculateFee(coinData) {
    let defaultData = {
      utxos: [],
      targets: [],
      feeRate: 0,
      currency: 'btc',
      minFee: 0,
      maxFee: 0
    };

    coinData = Object.assign(defaultData, coinData || {});

    if (coinData.utxos.length == 0)
      return this.result(false, false, 2011);

    if (coinData.targets.length == 0)
      return this.result(false, false, 2012);

    if (coinData.feeRate == 0 && coinData.minFee == 0)
      return this.result(false, false, 2013);

    let {
      fee
    } = this.getCoinSelect(coinData.currency)(coinData.utxos, coinData.targets, coinData.feeRate, coinData.minFee, coinData.maxFee);
    return this.result(true, fee, 0);
  }

  buildTransaction(coinData) {
    let defaultData = {
      currency: '',
      utxos: [],
      targets: [],
      feeRate: 0,
      changeAddress: '',
      minFee: 0,
      maxFee: 0
    };

    coinData = Object.assign(defaultData, coinData || {});
    if (this.isEmpty(coinData.currency))
      return this.result(false, null, 2002);

    if (coinData.utxos.length == 0)
      return this.result(false, false, 2011);

    if (coinData.targets.length == 0)
      return this.result(false, false, 2012);

    if (coinData.feeRate == 0)
      return this.result(false, false, 2013);

    if (coinData.changeAddress == '')
      return this.result(false, false, 2014);

    if (this.isBCH(coinData.currency)) {
      coinData.changeAddress = this.toLegacyAddressForBCH(coinData.changeAddress).data;
      coinData.targets.forEach(target => {
        target.address = this.toLegacyAddressForBCH(target.address).data;
      });
      let {
        inputs,
        outputs,
        fee
      } = this.getCoinSelect(coinData.currency)(coinData.utxos, coinData.targets, coinData.feeRate, coinData.minFee, coinData.maxFee);
      if (inputs && inputs.length > 0) {
        let coinDataX = CoinData[coinData.currency];
        let txb = new bitcoin.TransactionBuilder(coinDataX.network);
        inputs.forEach(input => {
          const keyPair = new bitcoin.ECPair.fromWIF(input.key, coinDataX.network);
          const pk = keyPair.getPublicKeyBuffer();
          const pkh = bitcoin.crypto.hash160(pk);
          const spk = bitcoin.script.pubKeyHash.output.encode(pkh);
          txb.addInput(input.txId, input.vout, bitcoin.Transaction.DEFAULT_SEQUENCE, spk);
        });
        outputs.forEach(output => {
          if (!output.address) {
            output.address = coinData.changeAddress;
          };
          txb.addOutput(output.address, output.value)
        });
        txb.enableBitcoinCash(true);
        txb.setVersion(2)
        const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143;
        inputs.forEach((input, index) => {
          const keyPair = new bitcoin.ECPair.fromWIF(input.key, coinDataX.network);
          txb.sign(index, keyPair, null, hashType, input.value);
        });
        let txHex = txb.build().toHex();
        return this.result(true, txHex, 0);
      }
    } else if (this.isBTG(coinData.currency)) {
      let {
        inputs,
        outputs,
        fee
      } = this.getCoinSelect(coinData.currency)(coinData.utxos, coinData.targets, coinData.feeRate, coinData.minFee, coinData.maxFee);
      if (inputs && inputs.length > 0) {
        let coinDataX = CoinData[coinData.currency];
        let txb = new bitcoin.TransactionBuilder(coinDataX.network);
        inputs.forEach(input => {
          const keyPair = new bitcoin.ECPair.fromWIF(input.key, coinDataX.network);
          const pk = keyPair.getPublicKeyBuffer();
          const pkh = bitcoin.crypto.hash160(pk);
          const spk = bitcoin.script.pubKeyHash.output.encode(pkh);
          txb.addInput(input.txId, input.vout, bitcoin.Transaction.DEFAULT_SEQUENCE, spk);
        });
        outputs.forEach(output => {
          if (!output.address) {
            output.address = coinData.changeAddress;
          };
          txb.addOutput(output.address, output.value)
        });
        txb.enableBitcoinGold(true)
        txb.setVersion(2)
        const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143;
        inputs.forEach((input, index) => {
          const keyPair = new bitcoin.ECPair.fromWIF(input.key, coinDataX.network);
          txb.sign(index, keyPair, null, hashType, input.value);
        });
        let txHex = txb.build().toHex();
        return this.result(true, txHex, 0);
      }
    } else {
      let {
        inputs,
        outputs,
        fee
      } = this.getCoinSelect(coinData.currency)(coinData.utxos, coinData.targets, coinData.feeRate, coinData.minFee, coinData.maxFee);

      if (inputs && inputs.length > 0) {
        let coinDataX = CoinData[coinData.currency];
        let txb = new bitcoin.TransactionBuilder(coinDataX.network);
        inputs.forEach(input => txb.addInput(input.txId, input.vout));
        outputs.forEach(output => {
          if (!output.address) {
            output.address = coinData.changeAddress;
          };
          txb.addOutput(output.address, output.value)
        });
        inputs.forEach((input, index) => {
          const keyPair = new bitcoin.ECPair.fromWIF(input.key, coinDataX.network);
          txb.sign(index, keyPair);
        });
        let txHex = txb.build().toHex();
        return this.result(true, txHex, 0);
      };
    }
    return this.result(false, null, 2015);
  }

  signMultisigTransaction(txData) {
    let defaultData = {
      currency: '',
      txHex: '',
      key: '',
      redeemScript: ''
    };
    txData = Object.assign(defaultData, txData || {});

    if (this.isEmpty(txData.currency))
      return this.result(false, null, 2002);

    if (this.isEmpty(txData.txHex))
      return this.result(false, false, 2023);

    if (this.isEmpty(txData.key))
      return this.result(false, false, 2024);

    if (this.isEmpty(txData.redeemScript) && (txData.utxos && txData.utxos.length == 0))
      return this.result(false, false, 2025);
    
    let coinDataX = CoinData[txData.currency];
    let tx = bitcoin.Transaction.fromHex(txData.txHex);
    let txb = bitcoin.TransactionBuilder.fromTransaction(tx, coinDataX.network);
    const keyPair = new bitcoin.ECPair.fromWIF(txData.key, coinDataX.network);
    
    if(txData.utxos && txData.utxos.length > 0){
      txb.tx.ins.forEach(function (input, i) {
        txb.sign(i, keyPair, bitcoin.script.compile(new Buffer(txData.utxos[0].redeemScript, "hex")));
      });
    } else {
      txb.tx.ins.forEach(function (input, i) {
        txb.sign(i, keyPair, bitcoin.script.compile(new Buffer(txData.redeemScript, "hex")));
      });
    };
    
    let rawSignedTransaction = txb.build().toHex();
    return this.result(true, rawSignedTransaction, 0);
  }

  toCashAddressForBCH(address) {
    return this.result(true, bchaddr.toCashAddress(address), 0);
  }

  toLegacyAddressForBCH(address) {
    return this.result(true, bchaddr.toLegacyAddress(address), 0);
  }
}

class BCoinHolder {
  constructor(_bcoin) {
    this.bcoin = _bcoin;
  }
}

bcoinHolder = new BCoinHolder(new BCoin());
if (typeof window !== 'undefined') {
  window.bcoin = bcoinHolder.bcoin;
}
module.exports = bcoinHolder;