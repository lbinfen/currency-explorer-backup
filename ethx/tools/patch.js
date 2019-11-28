//patch missing blocks
var getConfig = require('../config');
var grabber = require('./grabber')

var config = getConfig('./config.json');
config.listenOnly = false;
grabber.patchBlocks(config);

