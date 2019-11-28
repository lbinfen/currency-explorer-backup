let ethx = require(__lib + "ethx.js")

module.exports = function (app) {
  app.get('/c/:erc20token', ethx.getErc20TokenMeta);
  app.get('/t/:hash', ethx.getTransaction);
  app.post('/t/push', ethx.sendTransaction);
  app.get('/a/:address/txs', ethx.getTransactionsByAddress);
  app.get('/a/:address/balance', ethx.getBalanceOfAddress);
  app.get('/a/:address/nonce', ethx.countTransaction);
  app.get('/gasPrice', ethx.getGasPrice);
  app.get('/erc20tokens', ethx.erc20tokens);
  app.post('/estimateGas', ethx.estimateGas);
};