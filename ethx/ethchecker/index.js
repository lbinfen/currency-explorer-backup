const common = require('./common');
const eth = require('./eth');
const btc = require('./btc');

let checkNodes = function (i, cs) {
  if (i >= common.config.nodes.length) {
    cs();
    return;
  }
  let onError = function (node, error) {
    error = `本地节点【${node.name}】 监控失败，发现错误：${error}`;
    common.info(error);
    common.notice(error);
    setTimeout(function () {
      checkNodes(i + 1, cs);
    }, 1000);
  };
  let onSuccess = function () {
    setTimeout(function () {
      checkNodes(i + 1, cs);
    }, 1000);
  };
  let node = common.config.nodes[i];
  switch (node.type) {
    case 'btc':
      btc.checkNode(common, node, () => { onSuccess(); }, error => { onError(node, error); });
      break;
    case 'eth':
      eth.checkNode(common, node, () => { onSuccess(); }, error => { onError(node, error); });
      break;
  }
};
let main = function () {
  checkNodes(0, function () {
    setTimeout(() => {
      main();
    }, common.config.checkRate * 1000)
  });
};
let welcome = `大家好！我是节点状态监控机器人！我正在监控【${common.config.nodes.map(m => m.name).join(',')}】等节点`;
common.info(welcome);
common.notice(welcome);
main();