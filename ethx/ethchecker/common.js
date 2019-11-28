let fs = require("fs");
let DingRobot = require('ding-robot');

let getJSONConfig = function (configPath) {
  configPath = configPath || 'config.json';
  if (!fs.existsSync(configPath)) {
    throw new Error('config.json not found '.concat(configPath));
  };
  let configContent = fs.readFileSync(configPath);
  if (!configContent) {
    return null;
  };
  let config = JSON.parse(configContent);
  return config;
};

let info = function (msg) {
  console.log(new Date().toLocaleTimeString() + ' ' + (msg));
};

let config = getJSONConfig();
let robot = new DingRobot(config.dingRobotApiKey);
let test = config.test;

let notice = function (msg) {
  if (!test) {
    robot.atAll(true).text(msg);
  }
}

let base64_encode = function (str) {
  return Buffer.from(str, "utf8").toString('base64');
}

module.exports = {
  config: config,
  notice: notice,
  info: info,
  base64_encode: base64_encode
};