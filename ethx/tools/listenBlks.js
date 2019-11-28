//listen latest blocks and pending transactions, and save them to mongodb.
var getConfig = require('../config');
var grabber = require('./grabber') 

var config = getConfig('./config.json');
config.listenOnly = true;
grabber.listenBlks(config);