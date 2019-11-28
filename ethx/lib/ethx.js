const Txfilter = require('./Txfilter')
const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const PendingTransaction = mongoose.model('PendingTransaction');
const Token = mongoose.model('Token');
const getConfig = require('./../config.js');
const Web3 = require("web3");
const etherUnits = require("./etherUnits.js")
const ERC20 = require('./ERC20')
let parallel = require('run-parallel')
let BigNumber = require('bignumber.js');

const web3 = new Web3(new Web3.providers.HttpProvider(getConfig().gethRpc));
const erc20 = new ERC20(web3);
const filters = new Txfilter(erc20);

function resolveNumber(numberQuery) {
  let number = parseInt(numberQuery)
  if (!Number.isFinite(number)) number = 0
  return number
}

function respond(req, res, err, result) {
  if (err) console.error(req.path, err)
  if (err) {
    let errMsg
    if (typeof err === 'number') {
      res.status(err)
    } else {
      if (typeof err === 'object' && err.message) {
        res.status((err.status && typeof err.status === 'number') ? err.status : 400)
        errMsg = '' + err.message
      } else {
        res.status(400)
        errMsg = '' + err
      }
    }
    res.json({
      error: errMsg
    })
    return res.end()
  }

  res.status(200)
  if (result !== undefined) {
    if (typeof result === 'string') res.send(result)
    else if (Buffer.isBuffer(result)) res.send(result)
    else res.json(result)
  }
  res.end()
};

function ethx() {}

ethx.getTransactionsByAddress = function (req, res) {
  let data = {
    status: false,
    message: 'No transactions found',
    result: []
  };
  let addr = req.params.address.toLowerCase();
  let contract = req.query.contract ? req.query.contract.toLowerCase() : '';
  let multisig = req.query.multisig;
  let skip = resolveNumber(req.query.skip) || 0;
  let limit = resolveNumber(req.query.limit) || 50;
  let type = resolveNumber(req.query.type) || 0; // 0: all 1: send 2: receive
  let findFilter = {};
  if (contract !== undefined && contract !== '') { //erc20
    //findFilter = { $and: [{ "to": contract }, { $or: [{ "from": addr }, { "recv": addr }] }] };
    let ors = [];
    if (type == 0 || type == 1) {
      ors.push({
        $and: [{
          "to": contract
        }, {
          "from": addr
        }]
      });
      ors.push({
        $and: [{
          "multiSig": true
        }, {
          "token": contract
        }, {
          "from": addr
        }]
      });
    };
    if (type == 0 || type == 2) {
      ors.push({
        $and: [{
          "to": contract
        }, {
          "recv": addr
        }]
      });
      ors.push({
        $and: [{
          "multiSig": true
        }, {
          "token": contract
        }, {
          "recv": addr
        }]
      });
    };
    findFilter = {
      $or: ors
    };
  } else {
    //findFilter = { $or: [{ "to": addr }, { "from": addr }] };
    if (multisig === '1') {
      //TODO:
      let ors = [];
      if (type == 0 || type == 1) {
        ors.push({
          "from": addr
        });
      };
      if (type == 0 || type == 2) {
        ors.push({
          "to": addr
        });
        ors.push({
          "recv": addr
        });
      };
      findFilter = {
        $or: ors
      };
    } else {
      let ors1 = [];
      let ors2 = [];
      if (type == 0 || type == 1) {
        ors1.push({
          "from": addr
        });
        ors2.push({
          "from": addr
        });
      };
      if (type == 0 || type == 2) {
        ors1.push({
          "to": addr
        });
        ors2.push({
          "recv": addr
        });
      };
      findFilter = {
        $or: [{
          $and: [{
            $or: ors1
          }, {
            $or: [{
              "multiSig": false
            }, {
              "multiSig": {
                $exists: false
              }
            }]
          }, {
            $or: [{
              "recv": ""
            }, {
              "recv": {
                $exists: false
              }
            }]
          }]
        }, {
          $and: [{
            $or: ors2
          }, {
            "multiSig": true
          }, {
            "token": {
              $exists: false
            }
          }]
        }]
      };
    }
  };
  let lastBlock = web3.eth.blockNumber;
  let find = Transaction.find(findFilter);
  find.count(function (err, count) {
    data.total = count;
    find.lean(true).sort('-timestamp').skip(skip).limit(limit).exec("find", function (err, docs) {
      let createRespond = function () {
        //返回结果
        if (data.result.length > 0) {
          data.status = true;
          data.message = 'OK';
        };
        respond(req, res, null, data);
      };
      let getPending = function (data) {
        //查找是否有Pending状态的交易
        let findPending = PendingTransaction.find(findFilter);
        if (skip == 0) {
          findPending.lean(true).skip(0).limit(50).exec("find", function (err, docsPending) {
            if (docsPending && docsPending.length > 0) {
              let result = filters.filterTXApi(docsPending, addr, lastBlock);
              result.forEach(el => {
                data.result.unshift(el);
              });
            }
            createRespond();
          });
        } else {
          createRespond();
        };
      };

      if (docs && docs.length > 0) {
        let tasks = {}
        let docMappings = {};
        docs.forEach(doc => {
          tasks[doc.hash] = (next) => web3.eth.getTransactionReceipt(doc.hash, next)
          docMappings[doc.hash] = doc;
        })
        parallel(tasks, (err, results) => {
          if (!err) {
            Object.keys(results).forEach(function (key) {
              docMappings[key].status = results[key].status;
            })
          }
          data.result = filters.filterTXApi(docs, addr, lastBlock);
          getPending(data);
        });
      } else {
        getPending(data);
      };
    });
  });
};

ethx.getBalanceOfAddress = function (req, res) {
  let addr = req.params.address;
  let contract = req.query.contract;
  if (contract) {
    let balanceOf = erc20.balanceOf(contract, addr);
    respond(req, res, null, balanceOf);
  } else {
    web3.eth.getBalance(addr, function (error, result) {
      if (error) {
        respond(req, res, error, null);
      } else {
        let data = {
          symbol: 'ETH',
          amount: etherUnits.toEther(result, 'wei')
        };
        respond(req, res, null, data);
      };
    });
  };
};

ethx.getGasPrice = function (req, res) {
  web3.eth.getGasPrice(function (error, result) {
    if (error) {
      respond(req, res, error, null);
    } else {
      let data = [{
        symbol: 'ETH',
        amount: etherUnits.toEther(result, 'wei')
      }, {
        symbol: 'GWEI',
        amount: etherUnits.toGwei(result, 'wei')
      }, {
        symbol: 'WEI',
        amount: result
      }];
      respond(req, res, null, data);
    }
  });
};

ethx.estimateGas = function (req, res) {
  let to = req.body.to;
  let from = req.body.from;
  let value = req.body.value;
  let contract = req.body.contract;
  let nonce = req.body.nonce;

  if (contract) {
    let tokenMeta = erc20.getErc20TokenMeta(contract);
    value = new BigNumber(value).times(Math.pow(10, new Number(tokenMeta.decimals))).toString(10);
    erc20.estimateGas({
      contract,
      from,
      to,
      value,
      nonce
    }, function (error, result) {
      if (error) {
        respond(req, res, error, null);
      } else {
        respond(req, res, null, {
          "gas": result
        });
      };
    });
  } else {
    value = etherUnits.toWei(new Number(value), 'ether')
    let data = req.body.data;
    let options = {
      from,
      to,
      value,
      nonce,
      data
    };
    web3.eth.estimateGas(options, function (error, result) {
      if (error) {
        respond(req, res, error, null);
      } else {
        respond(req, res, null, {
          "gas": result
        });
      };
    });
  };
};

ethx.getTransaction = function (req, res) {
  let get = function (doc) {
    web3.eth.getTransaction(hash, function (error, tran) {
      if (error || tran == null) {
        respond(req, res, error || 404, null);
      } else {
        if (doc && doc.timestamp) {
          tran.timestamp = doc.timestamp;
        }
        if (tran.blockNumber == 0) {
          let result = filters.filterTranReceipt(doc, null, tran, null, 0);
          respond(req, res, null, result);
        } else {
          web3.eth.getBlock(tran.blockNumber, function (error2, block) {
            if (error2) {
              respond(req, res, error2, null);
            } else {
              web3.eth.getTransactionReceipt(hash, function (error3, receipt) {
                if (error3) {
                  respond(req, res, error3 || 404, null);
                } else {
                  let lastBlock = web3.eth.blockNumber;
                  let result = filters.filterTranReceipt(doc, block, tran, receipt, lastBlock);
                  respond(req, res, null, result);
                };
              });
            };
          });
        };
      };
    });
  };
  let hash = req.params.hash;
  Transaction.find({
    "hash": hash
  }).limit(1).exec("find", function (err, docs) {
    if (err || docs == null || docs.length == 0) {
      PendingTransaction.find({
        "hash": hash
      }).limit(1).exec("find", function (pendingErr, pendingDocs) {
        if (pendingErr || pendingDocs == null || pendingDocs.length == 0) {
          get(null);
        } else {
          get(pendingDocs[0]);
        }
      });
    } else {
      get(docs[0]);
    };
  });
};

ethx.sendTransaction = function (req, res) {
  let tx = req.body.tx;
  if (!tx || tx.length == 0) {
    respond(req, res, 400, null);
  } else {
    web3.eth.sendRawTransaction(tx, function (error, tran) {
      if (error) {
        respond(req, res, error, null);
      } else {
        respond(req, res, null, {
          "hash": tran
        });
      };
    });
  };
};

ethx.countTransaction = function (req, res) {
  let addr = req.params.address;
  if (!addr || addr.length == 0) {
    respond(req, res, 400, null);
  } else {
    web3.eth.getTransactionCount(addr, function (error, count) {
      if (error) {
        respond(req, res, error, null);
      } else {
        respond(req, res, null, {
          "nonce": count
        });
      };
    });
  };
};

ethx.getErc20TokenMeta = function (req, res) {
  let erc20token = req.params.erc20token;
  if (!erc20token || erc20token.length == 0) {
    respond(req, res, 400, null);
  } else {
    let result = erc20.getErc20TokenMeta(erc20token);
    respond(req, res, null, result);
  };
};

ethx.erc20tokens = function (req, res) {
  let skip = resolveNumber(req.query.skip) || 0;
  let limit = resolveNumber(req.query.limit) || 50;
  let findFilter = {
    "_id": {
      $ne: null
    }
  };
  let find = Token.find(findFilter);
  find.count(function (err, count) {
    find.lean(true).sort('-_id').skip(skip).limit(limit).exec("find", function (err, docs) {
      let data = {
        total: count,
        result: docs.map(d => d._id)
      };
      respond(req, res, null, data);
    });
  });
};

module.exports = ethx;