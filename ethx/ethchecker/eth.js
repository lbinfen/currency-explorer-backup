let request = require("request");
let Web3 = require('web3');

let checkNode = function (common, node, cs, ce) {
  let web3 = new Web3(Web3.givenProvider || node.url);
  let options = {
    method: 'GET',
    url: node.etherscanUrl,
    qs: {
      action: 'eth_blockNumber',
      module: 'proxy',
      apikey: node.etherscanApikey
    },
    headers: {
      'cache-control': 'no-cache',
      Connection: 'keep-alive',
      'Accept-Encoding': 'gzip, deflate',
      'Cache-Control': 'no-cache',
      Accept: '*/*',
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      ce(error);
      return;
    };
    let data;
    try {
      data = JSON.parse(body);
    } catch (ex) {
      ce(ex);
      return;
    }
    let remoteBlockNumber = web3.utils.hexToNumber(data.result);
    web3.eth.getBlockNumber().then(localBlockNumber => {
      common.info(`节点【${node.name}】 区块数(${localBlockNumber}) 远程区块数(${remoteBlockNumber})`);
      if (localBlockNumber + 100 < remoteBlockNumber) {
        let msg = `节点【${node.name}】区块数(${localBlockNumber})落后于远程区块数(${remoteBlockNumber})共计${remoteBlockNumber - localBlockNumber}个区块`;
        common.notice(msg);
      }
      cs();
    });
  });

};

module.exports = {
  checkNode: checkNode
};