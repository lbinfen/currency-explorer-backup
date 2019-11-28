let request = require("request");

let checkNode = function (common, node, cs, ce) {
  let options = {
    method: 'POST',
    url: node.rpc,
    headers: {
      'cache-control': 'no-cache',
      Connection: 'keep-alive',
      'Accept-Encoding': 'gzip, deflate',
      'Cache-Control': 'no-cache',
      Accept: '*/*',
      Authorization: 'Basic '.concat(common.base64_encode(`${node.rpcuser}:${node.rpcpwd}`)),
      'Content-Type': 'application/json'
    },
    body: {
      jsonrpc: '1.0',
      id: 'curltest',
      method: 'getblockcount',
      params: []
    },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) {
      ce(error);
      return;
    };
    if (!body || !body.result) {
      ce('获取远程区块数出错');
      return;
    }
    let remoteBlockNumber = body.result;
    options = {
      method: 'GET',
      url: node.url.concat('/status'),
      headers: {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        Accept: '*/*'
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
      let localBlockNumber = data.indexBlock;
      common.info(`节点【${node.name}】 区块数(${localBlockNumber}) 远程区块数(${remoteBlockNumber})`);
      if (localBlockNumber + 5 < remoteBlockNumber) {
        let msg = `节点【${node.name}】区块数(${localBlockNumber})落后于远程区块数(${remoteBlockNumber})共计${remoteBlockNumber - localBlockNumber}个区块`;
        common.info(msg);
        common.notice(msg);
      }
      cs();
    });
  });
};

module.exports = {
  checkNode: checkNode
};