const CoinData = require("./coindata");
const ecc = require('eosjs-ecc');
const BigNumber = require('bignumber.js');

class VHKDIOCoin {
  constructor() {}

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

  formatHex(hex) {
    if (hex.substr(0, 2) == '0x') {
      hex = hex.substr(2);
    };
    return hex;
  }

  hexToUint8Array(hex) {
    if (typeof hex !== 'string') {
      throw new Error('Expected string containing hex digits');
    }
    if (hex.length % 2) {
      throw new Error('Odd number of hex digits');
    }
    const l = hex.length / 2;
    const result = new Uint8Array(l);
    for (let i = 0; i < l; ++i) {
      const x = parseInt(hex.substr(i * 2, 2), 16);
      if (Number.isNaN(x)) {
        throw new Error('Expected hex string');
      }
      result[i] = x;
    }
    return result;
  };

  arrayToHex(data) {
    let result = '';
    for (const x of data) {
      result += ('00' + x.toString(16)).slice(-2);
    }
    return result;
  };

  calculateFee(data) {
    let defaultData = {
      currency: '',
      quantity: 0,
      feeRate: 0,
      minFee: 0.01,
      maxFee: 100
    };

    data = Object.assign(defaultData, data || {});

    if (this.isEmpty(data.currency))
      return this.result(false, null, 2002);

    if (data.quantity < 0)
      return this.result(false, null, 2026);

    if (data.feeRate == 0 && data.minFee == 0)
      return this.result(false, false, 2013);

    let fee = new BigNumber(data.quantity).times(data.feeRate).toNumber();

    if (data.minFee > 0 && fee > 0 && fee < data.minFee) {
      fee = data.minFee;
    };

    if (data.maxFee > 0 && fee > data.maxFee) {
      fee = data.maxFee;
    };

    return this.result(true, fee, 0);
  }

  createTransfer(data) {
    let defaultData = {
      currency: "",
      from: "",
      to: "",
      quantity: 0,
      fee: 0,
      memo: ""
    };

    data = Object.assign(defaultData, data || {});

    if (this.isEmpty(data.currency))
      return this.result(false, null, 2002);

    if (this.isEmpty(data.from))
      return this.result(false, null, 2016);

    if (this.isEmpty(data.to))
      return this.result(false, null, 2017);

    if (data.quantity <= 0)
      return this.result(false, null, 2026);

    if (data.fee <= 0)
      return this.result(false, null, 2027);

    let transaction = {
      account: "eosio.token",
      authorization: [{
        actor: data.from,
        permission: "active"
      }],
      name: "transferex",
      data: {
        from: data.from,
        to: data.to,
        quantity: new Number(data.quantity).toFixed(4).concat(' VHKD'),
        fee: new Number(data.fee).toFixed(4).concat(' VHKD'),
        memo: data.memo
      }
    };

    return this.result(true, transaction, 0);
  };

  signTransaction(tranData) {
    let that = this;
    let defaultData = {
      currency: '',
      key: '',
      serializedTransaction: ''
    };
    tranData = Object.assign(defaultData, tranData || {});

    if (this.isEmpty(tranData.currency))
      return this.result(false, null, 2002);

    if (this.isEmpty(tranData.key))
      return this.result(false, null, 2024);

    if (this.isEmpty(tranData.serializedTransaction))
      return this.result(false, null, 2028);

    let coinData = CoinData[tranData.currency];
    tranData.chainId = coinData.chainId;

    let serializedTransaction = that.hexToUint8Array(tranData.serializedTransaction);
    const signBuf = Buffer.concat([
      new Buffer(tranData.chainId, 'hex'), new Buffer(serializedTransaction), new Buffer(new Uint8Array(32)),
    ]);
    const signatures = [ecc.Signature.sign(signBuf, tranData.key).toString()];
    return this.result(true, {
      signatures,
      compression: 0,
      packed_context_free_data: '',
      packed_trx: that.arrayToHex(serializedTransaction),
    }, 0);
  };

  randomAccountName(data) {
    let defaultData = {
      prefix: '',
      t: 12
    };
    data = Object.assign(defaultData, data || {});
    for (var n = 'abcdefghijklmnpqrstuvwxyz12345', e = '', o = 0; o < data.t; o++)
      e += n.charAt(Math.floor(Math.random() * n.length));
    return this.result(true, data.prefix.concat(e), 0);
  };

}

function VHKDIOCoinHolder(_vhkdiocoin) {
  this.vhkdiocoin = _vhkdiocoin;
};

vhkdioCoinHolder = new VHKDIOCoinHolder(new VHKDIOCoin());
if (typeof window !== 'undefined') {
  window.vhkdiocoin = vhkdioCoinHolder.vhkdiocoin;
}
module.exports = vhkdioCoinHolder;