var mongoose = require('mongoose');
var getConfig = require('./config');

var Schema = mongoose.Schema;

var Block = new Schema({
  "number": {
    type: Number,
    index: {
      unique: true
    }
  },
  "hash": String,
  "parentHash": String,
  "nonce": String,
  "sha3Uncles": String,
  "logsBloom": String,
  "transactionsRoot": String,
  "stateRoot": String,
  "receiptRoot": String,
  "miner": String,
  "difficulty": String,
  "totalDifficulty": String,
  "size": Number,
  "extraData": String,
  "gasLimit": Number,
  "gasUsed": Number,
  "timestamp": Number,
  "uncles": [String],
  "confirmed": Boolean
});

var Contract = new Schema({
  "address": {
    type: String,
    index: {
      unique: true
    }
  },
  "creationTransaction": String,
  "contractName": String,
  "compilerVersion": String,
  "optimization": Boolean,
  "sourceCode": String,
  "abi": String,
  "byteCode": String
}, {
  collection: "Contract"
});

var Transaction = new Schema({
  "hash": {
    type: String,
    index: {
      unique: true
    }
  },
  "nonce": Number,
  "blockHash": String,
  "blockNumber": Number,
  "transactionIndex": Number,
  "from": String,
  "to": String,
  "value": String,
  "gas": Number,
  "gasPrice": String,
  "timestamp": Number,
  "input": String,
  "recv": String,
  "amount": String,
  "token": String,
  "multiSig": Boolean
});

var PendingTransaction = Transaction;

var Token = new Schema({
  "value": {
    "count": Number
  }
});

mongoose.model('Block', Block);
mongoose.model('Contract', Contract);
mongoose.model('Transaction', Transaction);
mongoose.model('PendingTransaction', PendingTransaction);
mongoose.model('Token', Token);
module.exports.Block = mongoose.model('Block');
module.exports.Contract = mongoose.model('Contract');
module.exports.Transaction = mongoose.model('Transaction');
module.exports.PendingTransaction = mongoose.model('PendingTransaction');
module.exports.Token = mongoose.model('Token');

const options = {
  //useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  useMongoClient: true,
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose.Promise = global.Promise;
mongoose.connect(getConfig().mongoUri || process.env.MONGO_URI || 'mongodb://localhost/blockDB', options);
mongoose.set('debug', false);