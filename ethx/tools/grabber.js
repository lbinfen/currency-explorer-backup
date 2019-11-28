require('../db.js');
var etherUnits = require("../lib/etherUnits.js");
var BigNumber = require('bignumber.js');

var Web3 = require('web3');
var getConfig = require('../config');
var config = getConfig('./config.json');

var mongoose = require('mongoose');
var Block = mongoose.model('Block');
var Transaction = mongoose.model('Transaction');
var PendingTransaction = mongoose.model('PendingTransaction');
let ObjectID = require('mongodb').ObjectID;
let fs = require('fs');

const MultiSignV2 = require('./../lib/MultiSignV2');
const ERC20 = require('./../lib/ERC20');

const web3 = new Web3(new Web3.providers.HttpProvider(config.gethRpc));
const erc20 = new ERC20(web3);
const multiSignV2 = new MultiSignV2();

const CONFIRM_NUM = 12;

var saveBlocks = function (config) {
  var web3 = new Web3(new Web3.providers.HttpProvider(config.gethRpc));

  if ('listenOnly' in config && config.listenOnly === true) {
    listenBlocks(config, web3);
  } else
    setTimeout(function () {
      grabBlock(config, web3, config.blocks.pop());
    }, 2000);

}

var listenBlocks = function (config, web3) {
  runWriteTask(config, 1000);

  var newBlocks = web3.eth.filter("latest");
  newBlocks.watch(function (error, log) {
    if (error) {
      console.log('Error: ' + error);
      process.exit(9); //geth程序有可能中途退出，grabber也退出由pm2重启
    } else if (log == null) {
      console.log('Warning: null block hash');
    } else {
      getLatestBlock(config, web3, log);
    }

  });
}

//监听new pending transaction，保存到mongodb
var listenTransactions = function (config, web3) {
  var newTransaction = web3.eth.filter("pending");

  newTransaction.watch(function (err, txid) {
    if (typeof err !== 'undefined' && err) {
      console.log('Error: ' + err);
      process.exit(9); //geth程序有可能中途退出，grabber也退出由pm2重启
    } else if (txid == null) {
      console.log('Warning: null pending tx hash');
    } else {
      console.log('New pending tx arrived: ' + txid);
      grabPendingTransaction(web3, txid);
    }
  });
}

//根据txid从RPC获取详细数据
var grabPendingTransaction = function (web3, txid) {

  web3.eth.getTransaction(txid, function (err, txData) {
    if (typeof err !== 'undefined' && err) {
      console.log('Error: ' + err);
    } else if (txData == null) {
      console.log('Warning: null pending tx data, txid:' + txid.toString());
    } else {
      if (!('quiet' in config && config.quiet === true)) {
        console.log('Get pending tx by RPC: ' + txid);
      }
      writePendingTransaction(txData);
    }
  });
}

//transferType: 0 any 1 ether 2 erc20
//grabber.js崩溃(0xc1ea91cfabf32e819d6852eac5f50df8e14d573a308d0b3eb7228245a36016ff)
var handleTxData = function (txData) {
  //提取代币转账接收地址和数额
  if (txData.input.indexOf('0xa9059cbb') == 0) { //ERC20 transfer
    txData.recv = '0x' + txData.input.substr(34, 40) //接收地址固定40个字符
    txData.amount = '0x' + txData.input.substr(74, 64).replace(/\b(0+)/gi, ""); //金额取64个字符去掉前面的0
    txData.multiSig = false;
    txData.transferType = 2;
  } else if (txData.input.indexOf('0xf12d394f') == 0) { //多重签名excute v1
    if (txData.input.indexOf('a9059cbb') >= 0) { //转代币
      var sigNum = parseInt(txData.input.substr(394, 64).replace(/\b(0+)/gi, ""), 16); //获取签名个数(10+7*64)
      var recvPos = 10 + 10 * 64 + sigNum * 3 * 64 + 8 + 24;
      txData.recv = '0x' + txData.input.substr(recvPos, 40);
      txData.amount = '0x' + txData.input.substr(recvPos + 40, 64).replace(/\b(0+)/gi, "");
      txData.token = '0x' + txData.input.substr(10 + 64 * 3 + 24, 40);
      txData.transferType = 2;
    } else { //转ETH
      txData.recv = '0x' + txData.input.substr(226, 40)
      txData.amount = '0x' + txData.input.substr(266, 64).replace(/\b(0+)/gi, "");
      txData.transferType = 1;
    }
    txData.multiSig = true;
  } else if (txData.input.indexOf('0x0ae4a584') == 0) { //多重签名excute v2
    let inputData = multiSignV2.decodeInput(txData.input);
    let value = inputData.value;
    if (value == '0x') { //转代币
      let tokenData = erc20.decodeInput(inputData.destination, inputData.data);
      txData.recv = tokenData.to;
      txData.amount = tokenData.value;
      txData.token = tokenData.token;
      txData.transferType = 2;
    } else { //转ETH
      txData.recv = inputData.destination;
      txData.amount = value;
      txData.transferType = 1;
    }
    txData.multiSig = true;
  } else {
    txData.multiSig = false;
    txData.transferType = (txData.value == '0' || txData.value == 0) ? 0 : 1;
    if (txData.input.length > 10) {
      txData.input = txData.input.substr(0, 10); //其它合约接口只保留接口ID
    }
  }
}

//写到PendingTransactions表
var writePendingTransaction = function (txData) {
  txData.value = etherUnits.toEther(new BigNumber(txData.value), 'wei');
  handleTxData(txData);
  if (txData.transferType == 0) {
    console.log('Skip: contract transaction: ' + txData.hash);
    return;
  };
  txData.timestamp = parseInt((new Date().getTime()) / 1000); //增加时间戳，方便清理过期pending交易。
  //删除PendingTransaction集合中跟此交易的from地址和nonce相同的交易(使用相同nonce修改交易时)
  PendingTransaction.collection.deleteOne({
    $and: [{
      from: txData.from
    }, {
      nonce: txData.nonce
    }]
  }, function (err, res) {
    if (typeof err !== 'undefined' && err) {
      console.log('Error: Failed to deleted pending tx, Aborted due to error: ' + err);
      process.exit(9);
    } else if (res.deletedCount > 0) {
      if (!('quiet' in config && config.quiet === true)) {
        console.log('DB successfully deleted 1 pending tx from ' + txData.from +
          ' by the same nonce: ' + txData.nonce.toString() + ', new tx: ' + txData.hash);
      }
    }
    PendingTransaction.collection.updateOne({
      hash: txData.hash
    }, txData, {
        upsert: true
      }, function (err, res) {
        if (typeof err !== 'undefined' && err) {
          if (err.code == 11000) {
            console.log('Skip: Failed to upsert pending tx, Duplicate key ' + err);
          } else {
            console.log('Error: Failed to upsert pending tx, Aborted due to error: ' + err);
            process.exit(9);
          }
        } else {
          if (!('quiet' in config && config.quiet === true)) {
            console.log('DB successfully written for pending tx: ' + txData.hash);
          }
        }
      });
  });
}

//删除pendin
var delPendingTransactions = function (blockData) {
  var txHashes = getTxHashes(blockData.transactions);
  PendingTransaction.collection.deleteMany({
    hash: {
      $in: txHashes
    }
  }, function (err, res) {
    if (typeof err !== 'undefined' && err) {
      console.log('1Error: Aborted due to error: ' + err);
      process.exit(9);
    } else if (res.deletedCount > 0 && !('quiet' in config && config.quiet === true)) {
      console.log('DB successfully delete for ' + res.deletedCount +
        ' pending tx in block ' + blockData.number.toString());
    }
    delPendingTxsByNonce(blockData.transactions);
  });
}

var delPendingTxsByNonce = function (txs) {
  //删除PendingTransaction集合中跟此交易的from地址和nonce相同的交易    
  var txNonces = getTxNonces(txs);
  var txDels = [];
  //过滤from相同最nonce最大的一个进行删除
  for (d in txNonces) {
    var txd = txNonces[d];
    for (e in txDels) {
      if (txd.from === txDels[e].from) {
        if (txd.nonce > txDels[e].nonce) {
          txDels.splice(e, 1, txd);
        }
      }
    }
    if (txDels.indexOf(txd) == -1) {
      txDels.push(txd);
    }
  }
  for (d in txDels) {
    PendingTransaction.collection.deleteMany({
      $and: [{
        from: txDels[d].from
      }, {
        nonce: {
          $lte: txDels[d].nonce
        }
      }]
    }, function (err, res) {
      if (typeof err !== 'undefined' && err) {
        console.log('Error: Failed to deleted pending tx, Aborted due to error: ' + err);
        process.exit(9);
      } else if (res.deletedCount > 0) {
        if (!('quiet' in config && config.quiet === true)) {
          console.log('DB successfully deleted ' + res.deletedCount.toString() + ' pending tx(s) by nonce');
        }
      }
    });
  }
}

//清理txHashes关联的无效块和无效块的所有交易
var delInvalidBlock = function (blockHashes, excludeBlockHash) {
  var blockDeleted = []; //已经删除的块，避免重复删除
  for (d in blockHashes) {
    if (blockHashes[d] === excludeBlockHash ||
      blockDeleted.indexOf(blockHashes[d]) >= 0) {
      continue;
    }
    blockDeleted.push(blockHashes[d]);
    console.log('DB would be deleted for invalid block: ' + blockHashes[d]);
    //异步删除无效块和交易
    Transaction.collection.deleteMany({
      blockHash: blockHashes[d]
    }, function (err, res) {
      if (typeof err !== 'undefined' && err) {
        console.log('2Error: Aborted due to error: ' + err);
        process.exit(9);
      } else if (res.deletedCount > 0) {
        console.log('DB successfully deleted for ' + res.deletedCount + ' txs in invalid block');
      }
    });
    Block.collection.deleteOne({
      hash: blockHashes[d]
    }, function (err, res) {
      if (typeof err !== 'undefined' && err) {
        console.log('3Error: Aborted due to error: ' + err);
        process.exit(9);
      } else if (res.deletedCount > 0) {
        console.log('DB successfully deleted for ' + res.deletedCount + ' invalid block');
      }
    });
  }
}

var latestBlocks = []; //保存监听到的块
var confirmedBlocks = []; //保存超过12个确认数的块
var patchBlockRanges = []; //保存待patch的块区间段
var runWriteTask = function (config, interval) {
  var web3 = new Web3(new Web3.providers.HttpProvider(config.gethRpc));
  setInterval(function () {
    //先处理完latest块
    if (latestBlocks.length > 0) {
      setTimeout(function () { //遇到相同块或不同块同时到达时，晚1秒执行去掉重复块
        writeBlockSync(config, latestBlocks.shift()); //块号相同时，先进先出，后到的为准
      }, 1000)
    } else if (confirmedBlocks.length > 0) {
      writeCfdBlkSync(config, confirmedBlocks.shift());
    } else if (patchBlockRanges.length > 0) {
      var blockRange = patchBlockRanges.pop();
      if (blockRange.start === blockRange.end) {
        grabBlock(config, web3, blockRange.start);
      } else {
        grabBlock(config, web3, blockRange);
      }
    }
  }, interval);
}

var historyLatest = []; //保存latest的历史记录
var historyConfirmed = []; //保存confirmed块的历史记录
//按顺序插入（如果geth中断一段时间后重新启动或网络阻塞一段时间，会来一堆不按顺序的块，保存交易冲突时可能是块号小的后到，删除了块号大的交易）
var addWriteTask = function (blockDataArr, blockData) {
  //优化latest块处理
  if (blockData.confirmed === false) {
    for (d in historyLatest) {
      if (blockData.number === historyLatest[d].number) {
        if (blockData.uncles.length <= historyLatest[d].uncles.length) { //叔块小于等于原来的抛弃
          //if (blockData.timestamp > historyLatest[d].timestamp) { //时间戳大于原数组中相同块时抛弃
          return;
        }
      }
    }
    historyLatest.push(blockData);
    if (historyLatest.length > CONFIRM_NUM) {
      historyLatest.shift();
    }
  } else {
    for (d in historyConfirmed) {
      if (blockData.number === historyConfirmed[d].number) {
        return;
      }
    }
    historyConfirmed.push(blockData);
    if (historyConfirmed.length > CONFIRM_NUM) {
      historyConfirmed.shift();
    }
  }

  //新块按块号从小到大的顺序插入数组
  var d = 0;
  for (d in blockDataArr) {
    if (blockData.number === blockDataArr[d].number) { //块号相同时抛弃（叔块较大时替换）
      if (blockData.uncles.length > historyLatest[d].uncles.length) {
        //if (blockData.timestamp <= blockDataArr[d].timestamp) { //时间戳小于或等于原数组中相同块时替换，后到的块为准更准确？
        blockDataArr.splice(d, 1, blockData);
      }
      return;
    } else if (blockData.number > blockDataArr[d].number) {
      d++;
    } else {
      break;
    }
  }
  blockDataArr.splice(d, 0, blockData);
  if (blockData.confirmed === false && blockDataArr.length > CONFIRM_NUM) { //latest队列只保留CONFIRM_NUM个块
    blockDataArr.shift();
  }
}

//添加待写块区间段
var addPatchTask = function (patchBlockRanges, blockRange) {
  //console.log('Added range: ' + JSON.stringify(blockRange));
  for (var d in patchBlockRanges) {
    if (parseInt(d) < patchBlockRanges.length - 1 &&
      blockRange.start <= patchBlockRanges[d].end + 1 &&
      blockRange.end >= patchBlockRanges[(parseInt(d) + 1).toString()].start - 1) { //添加区间正好连接前后两个区间
      patchBlockRanges[d].end = patchBlockRanges[(parseInt(d) + 1).toString()].end; //前后两区间合并
      patchBlockRanges.splice(parseInt(d) + 1, 1);
      return;
    }
    if (blockRange.start >= patchBlockRanges[d].start && blockRange.start <= patchBlockRanges[d].end + 1) { //添加的区间起点落在已有区间段或相连
      if (blockRange.end > patchBlockRanges[d].end) { //添加的区间终点比原有区间段终点大
        patchBlockRanges[d].end = blockRange.end;
        return;
      } else { //添加的区间无效
        console.log('Warning: Added invalid range: ' + JSON.stringify(blockRange));
        return;
      }
    } else if (blockRange.end >= patchBlockRanges[d].start - 1 && blockRange.end <= patchBlockRanges[d].end) { //添加的区间终点落在已有区间段或相连
      if (blockRange.start < patchBlockRanges[d].start) { //添加的区间起点比原有区间段起点小
        patchBlockRanges[d].start = blockRange.start;
        return;
      } else { //添加的区间无效
        console.log('Warning: Added invalid range: ' + JSON.stringify(blockRange));
        return;
      }
    } else if (blockRange.end < patchBlockRanges[0].start - 1) { //在第一个区间前并且不相连
      patchBlockRanges.splice(0, 0, blockRange);
      return;
    } else if (blockRange.start > patchBlockRanges[(patchBlockRanges.length - 1).toString()].end + 1) { //在最后一个区间后并且不相连
      patchBlockRanges.splice(patchBlockRanges.length + 1, 0, blockRange);
      return;
    } else if (blockRange.start > patchBlockRanges[d].end + 1 && blockRange.end < patchBlockRanges[(parseInt(d) + 1).toString()].start - 1) { //添加的区间起点和终点不在任意区间段并且不跟任意区间相连
      patchBlockRanges.splice(parseInt(d) + 1, 0, blockRange);
      return;
    } else if (blockRange.start < patchBlockRanges[d].start && blockRange.end > patchBlockRanges[d].end) { //添加的区间包含了已有区间，说明产生区间的算法有问题
      console.log('Warning: Added invalid range: ' + JSON.stringify(blockRange));
      return;
    }
  }
  if (patchBlockRanges.length == 0) { //添加第1个区间
    patchBlockRanges.push(blockRange);
  } else {
    console.log('Warning: Added invalid range: ' + JSON.stringify(blockRange));
    return;
  }
}

//保存最新块和交易数据
var getLatestBlock = function (config, web3, blockID) {
  if (web3.isConnected()) {
    web3.eth.getBlock(blockID, true, function (error, blockData) {
      if (error) {
        console.log('Warning: error on getting block with hash/number: ' + blockID + ', ' + error);
      } else if (blockData == null) {
        console.log('Warning: null block data received from the block with hash/number: ' + blockID);
      } else {
        console.log('Block ' + blockData.number.toString() + ' arrived, hash: ' + blockData.hash +
          ', timestamp: ' + blockData.timestamp.toString());
        //处理可信块
        getConfirmedBlock(config, web3, blockData.number - CONFIRM_NUM);
        //12个确认数以上的块认为是可信的，直接返回，由getConfirmedBlock处理。
        var confirmedBlock = web3.eth.blockNumber - CONFIRM_NUM;
        if (typeof blockID === 'string' && blockData.number < confirmedBlock) {
          return;
        }
        blockData.confirmed = false;
        addWriteTask(latestBlocks, blockData);
      }
    });
  } else {
    console.log('Error: Aborted due to web3 is not connected when trying to ' +
      'get block ' + blockID);
    process.exit(9);
  }
}

//保存确认块和交易数据
var getConfirmedBlock = function (config, web3, blockID) {
  if (web3.isConnected()) {
    web3.eth.getBlock(blockID, true, function (error, blockData) {
      if (error) {
        console.log('Warning: error on getting block with hash/number: ' + blockID + ', ' + error);
      } else if (blockData == null) {
        console.log('Warning: null block data received from the block with hash/number: ' + blockID);
      } else {
        if (!('quiet' in config && config.quiet === true)) {
          console.log('Block ' + blockData.number.toString() + ' confirmed, hash: ' + blockData.hash +
            ', timestamp: ' + blockData.timestamp.toString());
        }
        blockData.confirmed = true;
        addWriteTask(confirmedBlocks, blockData);
      }
    });
  } else {
    console.log('Error: Aborted due to web3 is not connected when trying to ' +
      'get block ' + blockID);
    process.exit(9);
  }
}

// 处理交易数据
var getTxDataes = function (blockData) {
  var bulkOps = [];
  for (d in blockData.transactions) {
    var txData = blockData.transactions[d];
    if (txData.timestamp === undefined) { //首次从geth取到数据才做下面的处理
      txData.value = etherUnits.toEther(new BigNumber(txData.value), 'wei');
      handleTxData(txData);
    }
    txData.timestamp = blockData.timestamp;
    if (txData.transferType != 0) {
      bulkOps.push(txData);
    }
  }
  return bulkOps;
}

//获取tx hash数组
var getTxHashes = function (txs) {
  return txs.map(function (tx) {
    return tx.hash;
  })
}

//获取block hash数组
var getBlockHashes = function (txs) {
  return txs.map(function (tx) {
    return tx.blockHash;
  })
}

//获取from nonce数组
var getTxNonces = function (txs) {
  return txs.map(function (tx) {
    return {
      from: tx.from,
      nonce: tx.nonce,
      hash: tx.hash
    };
  })
}

//监听时将打包的交易写到数据库，并删除pending交易，为了保证数据完整性，按顺序先写交易再写块，patch根据块修复数据。
var writeBlockSync = function (config, blockData) {
  if (blockData === undefined || blockData === null) {
    return;
  }
  var txHashes = getTxHashes(blockData.transactions);
  var bulkOps = getTxDataes(blockData);

  if (bulkOps.length > 0) {

    //保存新的交易
    var writeConcern = {
      writeConcern: {
        w: 'majority',
        j: false,
        wtimeout: 1000
      }
    }; //latest块对可靠性要求不高，优先考虑性能
    Transaction.collection.insertMany(bulkOps, writeConcern)
      .then(res => {
        writeBlock(config, blockData);
        delPendingTransactions(blockData);
      })
      .catch(err => {
        //重复块有可能分先后到达，也可能同时到达, 即有可能都没有插入到数据库，只有在这里等冲突了再删除先插入的
        if (err.code == 11000) {
          console.log('Warning: Duplicate key on writing txs of block, blockHash: ' + blockData.hash + ' ' + err);
          Transaction.find({
            hash: {
              $in: txHashes
            }
          }, {
              _id: 0,
              hash: 1,
              blockNumber: 1,
              blockHash: 1
            }).lean(true).exec("find")
            .then(docs => {
              if (!('quiet' in config && config.quiet === true)) {
                console.log('Find repeat txs:\n' + JSON.stringify(docs));
              }
              delInvalidBlock(getBlockHashes(docs), blockData.hash); //异步清理待删除的交易所在块的其它交易和块
              Transaction.collection.deleteMany({
                hash: {
                  $in: getTxHashes(docs)
                }
              }, writeConcern)
                .then(res => {
                  console.log('DB successfully deleted ' + res.deletedCount +
                    ' repeat txs by txHashes on saving block ' + blockData.number.toString() + ' hash: ' + blockData.hash);
                  //删除重复的交易后重来一次
                  writeBlockSync(config, blockData);
                })
                .catch(err => {
                  console.log('Error: Aborted due to deleteMany: ' + err);
                  process.exit(9);
                });
            })
            .catch(err => {
              console.log('Error:  Aborted due to find: ' + err);
              process.exit(9);
            });
        } else {
          console.log('4Error: Aborted due to error: ' + err);
          process.exit(9);
        }
      });
  } else {
    //0个交易也要保存块
    writeBlock(config, blockData);
  }
}

//可信的块更新状态
var writeCfdBlkSync = function (config, blockData) {
  if (blockData === undefined || blockData === null) {
    return;
  }
  var txHashes = getTxHashes(blockData.transactions);
  var bulkOps = getTxDataes(blockData);

  if (bulkOps.length > 0) {

    //保存新的交易
    Transaction.find({
      $and: [{
        blockHash: blockData.hash
      }, {
        hash: {
          $in: txHashes
        }
      }]
    }).lean(true).exec("find")
      .then(res => {
        if (res.length == txHashes.length) { //要保存的交易txHashes都在数据库里，并且blockHash为blockData.hash
          writeBlock(config, blockData);
          delPendingTransactions(blockData);
          return;
        } else {
          var writeConcern = {
            writeConcern: {
              w: 'majority',
              j: true,
              wtimeout: 1000
            }
          };
          var filterDel = {
            $or: [{
              blockNumber: blockData.number
            }, {
              hash: {
                $in: txHashes
              }
            }]
          };
          Transaction.collection.deleteMany(filterDel, writeConcern)
            .then(res => {
              if (res.deletedCount > 0) {
                console.log('DB successfully deleted ' + res.deletedCount +
                  ' repeat txs by txHashes on saving confirmed block ' + blockData.number.toString() + ' hash: ' + blockData.hash);
              }
              Transaction.collection.insertMany(bulkOps, writeConcern)
                .then(res => {
                  writeBlock(config, blockData);
                  delPendingTransactions(blockData);
                })
                .catch(err => {
                  if (err.code == 11000) {
                    console.log('Warning: Duplicate key, blockHash: ' + blockData.hash + ' ' + err);
                  } else {
                    console.log('5Error: Aborted due to error: ' + err);
                  }
                  process.exit(9);
                });
            })
            .catch(err => {
              console.log('Error: Aborted due to deleteMany: ' + err);
              process.exit(9);
            });
        }
      })
      .catch(err => {
        console.log('Error:  Aborted due to find: ' + err);
        process.exit(9);
      });
  } else {
    //0个交易也要保存块
    writeBlock(config, blockData);
  }
}

// 交易写到数据库，遇到记录重复时替换原有交易记录
var writeTransaction = function (txData) {
  var filter = {
    "hash": txData.hash
  };

  Transaction.collection.updateOne(filter, txData, {
    upsert: true
  }, function (err, res) {
    if (typeof err !== 'undefined' && err) {
      console.log('Error: Failed to upsert tx, Aborted due to error: ' + err);
      process.exit(9);
    } else if (!('quiet' in config && config.quiet === true)) {
      console.log('DB successfully upsert for tx: ' + txData.hash);
    }
  });
}

//监听时将块写到数据库，遇到块存在时替换原有块
var writeBlock = function (config, blockData) {
  var filter = {
    "number": blockData.number
  };
  var blockDataDB = {
    "number": blockData.number,
    "hash": blockData.hash,
    "parentHash": blockData.parentHash,
    "nonce": blockData.nonce,
    "sha3Uncles": blockData.sha3Uncles,
    "logsBloom": blockData.logsBloom,
    "transactionsRoot": blockData.transactionsRoot,
    "stateRoot": blockData.stateRoot,
    "receiptRoot": blockData.receiptRoot,
    "miner": blockData.miner,
    "difficulty": blockData.difficulty,
    "totalDifficulty": blockData.totalDifficulty,
    "size": blockData.size,
    "extraData": blockData.extraData,
    "gasLimit": blockData.gasLimit,
    "gasUsed": blockData.gasUsed,
    "timestamp": blockData.timestamp,
    "uncles": blockData.uncles,
    "confirmed": blockData.confirmed
  };
  //使用new会遇到_id重复的问题 
  return Block.collection.updateOne(filter, blockDataDB, {
    upsert: true
  }, function (err, res) {
    if (typeof err !== 'undefined' && err) {
      console.log('6Error: Aborted due to error on block ' + blockData.number.toString() + ': ' + err);
      process.exit(9);
    } else {
      var strLabel = blockData.confirmed ? 'confirmed' : 'latest';
      console.log('DB successfully upsert ' + strLabel + ' block ' + blockData.number.toString() +
        ' with ' + blockData.transactions.length.toString() + ' txs, hash: ' + blockData.hash);
    }
  });
}

//约定调grabBlock只能取12个确认数以后的块，数据认为是已经确认的。
var grabBlock = function (config, web3, blockHashOrNumber) {
  var desiredBlockHashOrNumber;

  // check if done
  if (blockHashOrNumber == undefined) {
    return;
  }

  if (typeof blockHashOrNumber === 'object') {
    if ('start' in blockHashOrNumber && 'end' in blockHashOrNumber) {
      desiredBlockHashOrNumber = blockHashOrNumber.end;
    } else {
      console.log('Error: Aborted becasue found a interval in blocks ' +
        'array that doesn\'t have both a start and end.');
      process.exit(9);
    }
  } else {
    desiredBlockHashOrNumber = blockHashOrNumber;
  }

  if (web3.isConnected()) {

    web3.eth.getBlock(desiredBlockHashOrNumber, true, function (error, blockData) {
      if (error) {
        console.log('Warning: error on getting block with hash/number: ' +
          desiredBlockHashOrNumber + ': ' + error);
      } else if (blockData == null) {
        console.log('Warning: null block data received from the block with hash/number: ' +
          desiredBlockHashOrNumber);
      } else {
        blockData.confirmed = true; //约定调grabBlock只能取12个确认数以后的块，数据认为是已经确认的。
        writeBlockSync(config, blockData);
        /*
        if ('terminateAtExistingDB' in config && config.terminateAtExistingDB === true) {
            checkBlockDBExistsThenWrite(config, blockData);
        }
        else {
            writeBlockToDB(config, blockData);
        }
        if (!('skipTransactions' in config && config.skipTransactions === true))
            writeTransactionsToDB(config, blockData);
        if ('listenOnly' in config && config.listenOnly === true)
            return;
        */
        if ('hash' in blockData && 'number' in blockData) {
          // If currently working on an interval (typeof blockHashOrNumber === 'object') and 
          // the block number or block hash just grabbed isn't equal to the start yet: 
          // then grab the parent block number (<this block's number> - 1). Otherwise done 
          // with this interval object (or not currently working on an interval) 
          // -> so move onto the next thing in the blocks array.
          if (typeof blockHashOrNumber === 'object' &&
            (
              (typeof blockHashOrNumber['start'] === 'string' && blockData['hash'] !== blockHashOrNumber['start']) ||
              (typeof blockHashOrNumber['start'] === 'number' && blockData['number'] > blockHashOrNumber['start'])
            )
          ) {
            blockHashOrNumber['end'] = blockData['number'] - 1;
            grabBlock(config, web3, blockHashOrNumber);
          }
          //解决在patch的同时还在执行grabber config.blocks导致大量主键冲突的bug
          /*
          else {
               grabBlock(config, web3, config.blocks.pop());
          }
          */
        } else {
          console.log('Error: No hash or number was found for block: ' + blockHashOrNumber);
          process.exit(9);
        }
      }
    });
  } else {
    console.log('Error: Aborted due to web3 is not connected when trying to ' +
      'get block ' + desiredBlockHashOrNumber);
    process.exit(9);
  }
}


var writeBlockToDB = function (config, blockData) {
  return new Block(blockData).save(function (err, block, count) {
    if (typeof err !== 'undefined' && err) {
      if (err.code == 11000) {
        console.log('Skip: Duplicate key ' +
          blockData.number.toString() + ': ' +
          err);
      } else {
        console.log('7Error: Aborted due to error on ' +
          'block number ' + blockData.number.toString() + ': ' +
          err);
        process.exit(9);
      }
    } else {
      console.log('DB successfully written block ' + blockData.number.toString() +
        ' with ' + blockData.transactions.length.toString() + ' txs, hash: ' + blockData.hash);
    }
  });
}

/**
 * Checks if the a record exists for the block number then ->
 *     if record exists: abort
 *     if record DNE: write a file for the block
 */
var checkBlockDBExistsThenWrite = function (config, blockData) {
  Block.find({
    number: blockData.number
  }, function (err, b) {
    if (!b.length)
      writeBlockToDB(config, blockData);
    else {
      console.log('Aborting because block number: ' + blockData.number.toString() +
        ' already exists in DB.');
      process.exit(9);
    }

  })
}

/**
    Break transactions out of blocks and write to DB
**/

var writeTransactionsToDB = function (config, blockData) {
  var txHashes = getTxHashes(blockData.transactions);
  var bulkOps = getTxDataes(blockData);
  if (bulkOps.length > 0) {

    Transaction.collection.insert(bulkOps, function (err, tx) {
      if (typeof err !== 'undefined' && err) {
        if (err.code == 11000) {
          console.log('Skip: Duplicate key ' +
            err);
        } else {
          console.log('8Error: Aborted due to error: ' +
            err);
          process.exit(9);
        }
      } else if (!('quiet' in config && config.quiet === true)) {
        console.log('DB successfully written for ' + blockData.transactions.length.toString() +
          ' txs in block ' + blockData.number.toString());
      }
    });
    delPendingTransactions(blockData);
  }
}

/*
  Patch Missing Blocks
*/
var patchBlocks = function (config) {
  var web3 = new Web3(new Web3.providers.HttpProvider(config.gethRpc));

  // number of blocks should equal difference in block numbers
  var firstBlock = config.blocks[0].start;
  //var lastBlock = web3.eth.blockNumber;
  var lastBlock = config.blocks[0].end;
  if (lastBlock === 'latest')
    lastBlock = web3.eth.blockNumber - CONFIRM_NUM;
  //补上缺失的块
  blockIter(web3, firstBlock, lastBlock, config);

  //更新监听时插入但没有confirmed的块，只有在异常退出并没有及时启动时会出现最大12个未确认
  var find = Block.find({
    $and: [{
      $or: [{
        confirmed: false
      }, {
        confirmed: {
          $exists: false
        }
      }]
    }, {
      number: {
        $gte: firstBlock,
        $lte: lastBlock
      }
    }]
  }, {
      _id: 0,
      number: 1,
      confirmed: 1
    });
  find.lean(true).sort('-blockNumber').exec("find")
    .then(docs => {
      docs.forEach(doc => {
        getConfirmedBlock(config, web3, doc.number);
      })
    })
    .catch(err => {
      console.log("Error: " + err);
      process.exit(9);
    })

  setTimeout(function () {
    runWriteTask(config, 100); //利用一下listenBlks代码
  }, 2000);
}

var blockIter = function (web3, firstBlock, lastBlock, config) {
  // if consecutive, deal with it
  if (lastBlock < firstBlock)
    return;
  if (lastBlock - firstBlock === 1) {
    [lastBlock, firstBlock].forEach(function (blockNumber) {
      Block.find({
        number: blockNumber
      }, function (err, b) {
        if (!(typeof err !== 'undefined' && err) && !b.length)
          //grabBlock(config, web3, firstBlock);
          //grabBlock(config, web3, blockNumber); //解决重复插入同一个块和遗漏块的问题
          addPatchTask(patchBlockRanges, {
            'start': blockNumber,
            'end': blockNumber
          });
      });
    });
  } else if (lastBlock === firstBlock) {
    Block.find({
      number: firstBlock
    }, function (err, b) {
      if (!(typeof err !== 'undefined' && err) && !b.length)
        //grabBlock(config, web3, firstBlock);
        addPatchTask(patchBlockRanges, {
          'start': firstBlock,
          'end': firstBlock
        });
    });
  } else {

    Block.count({
      number: {
        $gte: firstBlock,
        $lte: lastBlock
      }
    }, function (err, c) {
      var expectedBlocks = lastBlock - firstBlock + 1;

      console.log("Check blocks from " + firstBlock.toString() + " to " + lastBlock.toString() + ", total: " +
        expectedBlocks.toString() + ", missing: " + JSON.stringify(expectedBlocks - c));

      if (c === 0) {
        //grabBlock(config, web3, { 'start': firstBlock, 'end': lastBlock });
        addPatchTask(patchBlockRanges, {
          'start': firstBlock,
          'end': lastBlock
        });
        //console.log('ranges: ' + JSON.stringify(patchBlockRanges));
      } else if (expectedBlocks > c) {
        var midBlock = firstBlock + parseInt((lastBlock - firstBlock) / 2);
        blockIter(web3, firstBlock, midBlock, config);
        blockIter(web3, midBlock + 1, lastBlock, config);
      } else
        return;
    })
  }
}

//删除config.start前面的块和交易
var clearBlocks = function (config) {
  /* 备选方案，删除6个月前的块和交易
  var web3 = new Web3(new Web3.providers.HttpProvider(config.gethRpc));
  if (!web3.isConnected()) {
      console.log('Error: Failed to connect to the geth rpc');
      process.exit(9);
  }
  var maxBlocks = web3.eth.blockNumber - 6 * 30 * 24 * 60 * 4; //保留6个月的记录
  */
  var maxBlocks = config.blocks[0].start;
  Block.find().lean(true).sort({
    number: 1
  }).limit(1).exec("find")
    .then(docs => {
      var minBlocks = docs[0].number;
      if (minBlocks >= maxBlocks) {
        console.log('Error: No block need to be deleted, due to the min block ' + minBlocks +
          ' and the start block ' + maxBlocks + ' in config');
        return;
      }
      delBlocks(minBlocks, maxBlocks - 1);
    })
    .catch(err => {
      console.log('Error:  Aborted due to find: ' + err);
      process.exit(9);
    });
}

var delBlocks = function (minBlocks, maxBlocks) {
  Block.find({
    number: minBlocks
  }, function (err, block) {
    if (!(typeof err !== 'undefined' && err) && block.length) {
      //先删除块打包的交易
      Transaction.collection.deleteMany({
        blockNumber: block[0].number
      }, function (err, res) {
        if (typeof err !== 'undefined' && err) {
          console.log('9Error: Aborted due to error: ' + err);
          process.exit(9);
        } else if (res.deletedCount > 0) {
          console.log('DB successfully deleted for ' + res.deletedCount + ' txs in the block ' + block[0].number);
        }
        //删除块
        Block.collection.deleteOne({
          number: block[0].number
        }, function (err, res) {
          if (typeof err !== 'undefined' && err) {
            console.log('10Error: Aborted due to error: ' + err);
            process.exit(9);
          } else if (res.deletedCount > 0) {
            console.log('DB successfully deleted for the block ' + block[0].number);
          }
          //删除下一个块
          if (minBlocks < maxBlocks) {
            delBlocks(++minBlocks, maxBlocks);
          }
        });
      });
    } else { //没找到当前块删除下一个块
      if (minBlocks < maxBlocks) {
        delBlocks(++minBlocks, maxBlocks);
      }
    }
  });
}

//监听pending交易
var listenTxs = function (config) {
  var web3 = new Web3(new Web3.providers.HttpProvider(config.gethRpc));

  listenTransactions(config, web3);
}

//监听块
var listenBlks = function (config) {
  var web3 = new Web3(new Web3.providers.HttpProvider(config.gethRpc));

  listenBlocks(config, web3);
}

//mapReduce to create tokens collection and keep tokens refresh data
let readFromLocalFile = function (file) {
  if (!fs.existsSync(file))
    return '';

  let data = fs.readFileSync(file, 'utf-8');
  if (data) {
    data = data.trim();
  };
  return data;
};

let saveToLocalFile = function (file, content) {
  fs.writeFileSync(file, content, {
    'flag': 'w'
  });
};

let mapReduceTokens = function (config) {
  let tokensCollectionName = 'tokens';
  let mapFunc = function () {
    emit(this.to, {
      'count': 1
    });
  };
  let reduceFunc = function (key, values) {
    var current = {
      'count': 0
    };
    values.forEach(function (item) {
      current.count += item.count;
    });
    return current;
  };
  let retyWhenError = function (error) {
    if (error) {
      setTimeout(function () {
        mapReduceTokens(config);
      }, 10000);
    };
  };
  let getLastestObjectId = function (callback) {
    Transaction.find({
      transferType: 2
    }).lean(true).sort({
      '_id': -1
    }).limit(1).exec("find").then(docs => {
      if (docs.length > 0) {
        let _id = docs[0]._id
        console.log('getLastestObjectId ' + _id);
        callback(_id);
      } else {
        callback('');
      };
    }).catch(error => {
      console.log('Error: Failed to getLastestObjectId to error: ' + error);
      retyWhenError(error);
    });
  };
  let saveLastestObjectIdAndContinue = function (lastestObjectId) {
    if (lastestObjectId != '') {
      saveToLocalFile('./logs/lastestObjectId.log', lastestObjectId);
    };
    setTimeout(function () {
      mapReduceTokens(config);
    }, 60000);
  };
  let readLastestObjectId = function () {
    let content = readFromLocalFile('./logs/lastestObjectId.log');
    return content || '';
  };
  let startObjectId = readLastestObjectId();
  if (startObjectId != '') {
    console.log('found startObjectId ' + startObjectId);
    getLastestObjectId(function (lastestObjectId) {
      console.log('increment mapReduce start');
      Transaction.collection.mapReduce(mapFunc, reduceFunc, {
        query: {
          $and: [{
            transferType: 2
          },
          {
            _id: {
              $gt: new ObjectID(startObjectId)
            }
          }
          ]
        },
        out: {
          'reduce': tokensCollectionName
        }
      }, function (error, result) {
        if (error) {
          console.log('increment mapReduce error '.concat(error));
          retyWhenError(error);
        } else {
          console.log('increment mapReduce done');
          saveLastestObjectIdAndContinue(lastestObjectId);
        };
      });
    });
  } else {
    getLastestObjectId(function (lastestObjectId) {
      console.log('full mapReduce start');
      Transaction.collection.mapReduce(mapFunc, reduceFunc, {
        query: {
          transferType: 2
        },
        out: tokensCollectionName
      }, function (error, result) {
        if (error) {
          console.log('full mapReduce error '.concat(error));
          retyWhenError(error);
        } else {
          console.log('full mapReduce done');
          saveLastestObjectIdAndContinue(lastestObjectId);
        };
      });
    });
  };
};

module.exports = {
  listenTxs: listenTxs,
  listenBlks: listenBlks,
  patchBlocks: patchBlocks,
  clearBlocks: clearBlocks,
  delBlocks: delBlocks,
  mapReduceTokens: mapReduceTokens,
  handleTxData: handleTxData
}