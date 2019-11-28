'use strict';
var etherUnits = require("./etherUnits.js")
var BigNumber = require('bignumber.js');

function Txfilter(erc20) {
  this.erc20 = erc20;
};

/*
  Filter an array of TX 
*/
Txfilter.prototype.filterTX = function (txs, value) {
  return txs.map(function (tx) {
    return [tx.hash, tx.blockNumber, tx.from, tx.to,
    etherUnits.toEther(new BigNumber(tx.value), 'wei'), tx.gas, tx.timestamp
    ]
  })
};

Txfilter.prototype.filterTranReceipt = function (doc, block, tran, receipt, lastBlock) {
  let that = this;
  let gasPriceWei = tran.gasPrice.c.join();
  let value = '';
  let valueWei = '';
  value = etherUnits.toEther(new BigNumber(tran.value), "wei");
  valueWei = tran.value;
  let data = {
    blockNumber: (receipt ? receipt.blockNumber : tran.blockNumber) || 0,
    timeStamp: block ? block.timestamp : (tran ? tran.timestamp : 0),
    hash: receipt ? receipt.transactionHash : tran.hash,
    nonce: tran.nonce,
    blockHash: (receipt ? receipt.blockHash : tran.blockHash) || '',
    transactionIndex: (receipt ? receipt.transactionIndex : tran.transactionIndex) || 0,
    from: receipt ? receipt.from : tran.from,
    to: (receipt ? receipt.to : tran.to) || '',
    value: value,
    valueWei: valueWei,
    gas: tran.gas,
    gasPrice: etherUnits.toEther(new BigNumber(gasPriceWei), "wei"),
    gasPriceWei: gasPriceWei,
    gasPriceGwei: etherUnits.toGwei(new BigNumber(gasPriceWei), "wei"),
    gasUsed: receipt ? receipt.gasUsed : 0,
    fee: receipt ? etherUnits.toEther(new BigNumber(receipt.gasUsed * tran.gasPrice), "wei") : '',
    confirmations: receipt ? (lastBlock - receipt.blockNumber) : 0,
    status: receipt ? (receipt.status == '0x1') : false,
    tokensTransfered: {
      to: '',
      value: '',
      token: '',
      symbol: ''
    }
  };
  if(doc){
    if (doc._doc.transferType == 2) {
      let erc20Data = that.erc20.decodeInput(tran.to, tran.input);
      if (erc20Data) {
        data.tokensTransfered = erc20Data;
      };
    };
    if (doc._doc.multiSig && doc._doc.transferType == 1) {
      data.value = etherUnits.toEther(new BigNumber(doc._doc.amount), 'wei');
      data.valueWei = etherUnits.toWei(new BigNumber(doc._doc.amount), 'wei');
      data.from = data.to;
      data.to = doc._doc.recv;
    };
  } else {
    let erc20Data = that.erc20.decodeInput(tran.to, tran.input);
    if (erc20Data) {
      data.tokensTransfered = erc20Data;
    };
  };
  return data;
};

Txfilter.prototype.filterTXApi = function (txs, value, lastBlock) {
  let that = this;
  return txs.map(function (tx) {
    let from = tx.from;
    let to = tx.to || '';
    let gasPriceWei = tx.gasPrice.c.join();
    let token = tx.token || '';
    let amount = tx.amount || '';
    let symbol = '';
    if (amount != '' && tx.transferType == 2) {
      let tokenMeta = that.erc20.getErc20TokenMeta(tx.token || tx.to);
      symbol = tokenMeta.symbol;
      amount = etherUnits.toERC20Token(amount, tokenMeta.decimals);
      if (token == '') {
        token = to;
      };
    };
    let confirmations = lastBlock - tx.blockNumber;
    let value = '';
    let valueWei = '';
    let isEmptyBlockHash = !tx.blockHash || tx.blockHash == '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (isEmptyBlockHash) {
      confirmations = 0;
    };
    if (tx.value.c) {
      value = etherUnits.toEther(new BigNumber(tx.value.c.join()), "wei");
      valueWei = tx.value.c.join();
    } else {
      value = tx.value;
      valueWei = etherUnits.toWei(new Number(tx.value), 'ether');
    };
    if (tx.multiSig) {
      if (tx.transferType == 2) { //erc20
        //TODO:
      } else if (tx.transferType == 1) { // eth
        value = etherUnits.toEther(new BigNumber(amount), 'wei');
        valueWei = etherUnits.toWei(new BigNumber(amount), 'wei');
        from = to;
        to = tx.recv;
        tx.recv = null;
        amount = '';
        token = '';
      }
    }
    return {
      blockNumber: (tx.blockNumber !== undefined && tx.blockNumber !== null) ? tx.blockNumber : 0,
      timeStamp: (tx.timestamp !== undefined && tx.timestamp !== null) ? tx.timestamp : 0,
      hash: tx.hash,
      nonce: tx.nonce,
      blockHash: tx.blockHash || '',
      transactionIndex: (tx.transactionIndex !== undefined && tx.transactionIndex !== null) ? tx.transactionIndex : 0,
      from: from,
      to: to,
      value: value,
      valueWei: valueWei,
      gas: tx.gas,
      gasPrice: etherUnits.toEther(new BigNumber(gasPriceWei), "wei"),
      gasPriceWei: gasPriceWei,
      gasPriceGwei: etherUnits.toGwei(new BigNumber(gasPriceWei), "wei"),
      //isError: '', //
      //txreceipt_status: '', //tx.blockNumber < 4370000 ? (tx.isError == "1" ? "0" : "1") : tx.txreceipt_status,
      tokensTransfered: {
        to: (tx.recv !== undefined && tx.recv !== null) ? tx.recv : '',
        value: amount,
        token: token,
        symbol: symbol
      },
      //input: tx.input,
      //gasUsed: tx.gasUsed || 0, //tx.gasUsed,
      confirmations: confirmations,
      status: (tx.status == '0x1')
    };
  })
};

Txfilter.prototype.filterTrace = function (txs, value) {
  return txs.map(function (tx) {
    var t = tx;
    if (t.type == "suicide") {
      if (t.action.address)
        t.from = t.action.address;
      if (t.action.balance)
        t.value = etherUnits.toEther(new BigNumber(t.action.balance), "wei");
      if (t.action.refundAddress)
        t.to = t.action.refundAddress;
    } else {
      if (t.action.to)
        t.to = t.action.to;
      t.from = t.action.from;
      if (t.action.gas)
        t.gas = new BigNumber(t.action.gas).toNumber();
      if ((t.result) && (t.result.gasUsed))
        t.gasUsed = new BigNumber(t.result.gasUsed).toNumber();
      if ((t.result) && (t.result.address))
        t.to = t.result.address;
      t.value = etherUnits.toEther(new BigNumber(t.action.value), "wei");
    }
    return t;
  })
};

Txfilter.prototype.filterBlock = function (block, field, value) {
  var tx = block.transactions.filter(function (obj) {
    return obj[field] == value;
  });
  tx = tx[0];
  if (typeof tx !== "undefined")
    tx.timestamp = block.timestamp;
  return tx;
};

/* make blocks human readable */
Txfilter.prototype.filterBlocks = function (blocks) {
  let that = this;
  if (blocks.constructor !== Array) {
    var b = blocks;
    b.extraData = that.hex2ascii(blocks.extraData);
    return b;
  }
  return blocks.map(function (block) {
    var b = block;
    b.extraData = that.hex2ascii(block.extraData);
    return b;
  })
};

/* stupid datatable format */
Txfilter.prototype.datatableTX = function (txs) {
  return txs.map(function (tx) {
    return [tx.hash, tx.blockNumber, tx.from, tx.to,
    etherUnits.toEther(new BigNumber(tx.value), 'wei'), tx.gas, tx.timestamp
    ]
  })
};

Txfilter.prototype.internalTX = function (txs) {
  return txs.map(function (tx) {
    return [tx.transactionHash, tx.blockNumber, tx.action.from, tx.action.to,
    etherUnits.toEther(new BigNumber(tx.action.value), 'wei'), tx.action.gas, tx.timestamp
    ]
  })
};

Txfilter.prototype.hex2ascii = function (hexIn) {
  var hex = hexIn.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

module.exports = Txfilter;