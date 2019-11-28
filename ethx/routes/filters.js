'use strict';
var etherUnits = require(__lib + "etherUnits.js")
var BigNumber = require('bignumber.js');
/*
  Filter an array of TX 
*/
function filterTX(txs, value) {
  return txs.map(function(tx){
    return [tx.hash, tx.blockNumber, tx.from, tx.to, 
            etherUnits.toEther(new BigNumber(tx.value), 'wei'), tx.gas, tx.timestamp]
  })
}

function filterTXApi(txs, value) {
  return txs.map(function (tx) {
      return {
        blockNumber: (tx.blockNumber !== undefined && tx.blockNumber !== null) ? tx.blockNumber.toString() : '',
        timeStamp: (tx.timestamp !== undefined && tx.timestamp !== null) ? tx.timestamp.toString() : '',
        hash: tx.hash,
        nonce: tx.nonce.toString(),
        blockHash: tx.blockHash,
        transactionIndex: (tx.transactionIndex !== undefined && tx.transactionIndex !== null) ? tx.transactionIndex.toString() : '',
        from: tx.from,
        to: tx.to,
        value: etherUnits.toWei(new Number(tx.value), 'ether'),
        gas: tx.gas.toString(),
        gasPrice: tx.gasPrice.c.join(),
        isError: '', //
        txreceipt_status: '', //tx.blockNumber < 4370000 ? (tx.isError == "1" ? "0" : "1") : tx.txreceipt_status,
        input: tx.input,
        recv:  (tx.recv !== undefined && tx.recv !== null) ? tx.recv : '',
        amount:  (tx.amount !== undefined && tx.amount !== null) ? tx.amount : '',
        token:  (tx.token !== undefined && tx.token !== null) ? tx.token : '',
        gasUsed: '', //tx.gasUsed,
        confirmations: '' //lastBlock - tx.blockNumber,
      }
  })
}

function filterTrace(txs, value) {
  return txs.map(function(tx){
    var t = tx;
    if (t.type == "suicide") {
      if (t.action.address)
        t.from = t.action.address;
      if (t.action.balance)
        t.value = etherUnits.toEther( new BigNumber(t.action.balance), "wei");
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
      t.value = etherUnits.toEther( new BigNumber(t.action.value), "wei");            
    }
    return t;
  })
}

function filterBlock(block, field, value) {
  var tx = block.transactions.filter(function(obj) {
    return obj[field]==value;   
  });
  tx = tx[0];
  if (typeof tx !== "undefined")
    tx.timestamp = block.timestamp; 
  return tx;
}

/* make blocks human readable */
function filterBlocks(blocks) {
  if (blocks.constructor !== Array) {
    var b = blocks;
    b.extraData = hex2ascii(blocks.extraData);
    return b;
  }
  return blocks.map(function(block) {
    var b = block;
    b.extraData = hex2ascii(block.extraData);
    return b;
  })
}

/* stupid datatable format */
function datatableTX(txs) {
  return txs.map(function(tx){
    return [tx.hash, tx.blockNumber, tx.from, tx.to, 
            etherUnits.toEther(new BigNumber(tx.value), 'wei'), tx.gas, tx.timestamp]
  })
}

function internalTX(txs) {
  return txs.map(function(tx){
    return [tx.transactionHash, tx.blockNumber, tx.action.from, tx.action.to, 
            etherUnits.toEther(new BigNumber(tx.action.value), 'wei'), tx.action.gas, tx.timestamp]
  })
}


var hex2ascii = function (hexIn) {
    var hex = hexIn.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

module.exports = {
  filterBlock: filterBlock,
  filterBlocks: filterBlocks,
  filterTX: filterTX,
  filterTXApi: filterTXApi,
  filterTrace: filterTrace,
  datatableTX: datatableTX,
  internalTX: internalTX
}
