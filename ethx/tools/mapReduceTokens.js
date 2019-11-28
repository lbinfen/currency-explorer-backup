var getConfig = require('../config');
var grabber = require('./grabber');

var config = getConfig('./config.json');
config.listenOnly = true;
grabber.mapReduceTokens(config);    