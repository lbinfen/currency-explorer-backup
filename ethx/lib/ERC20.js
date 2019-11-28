const abi = require('./abi.js');
const etherUnits = require("./etherUnits.js")
const InputDataDecoder = require('ethereum-input-data-decoder');

function ERC20(web3) {
  this.web3 = web3;
}

ERC20.prototype.erc20TokenMeta = {};

ERC20.prototype.getErc20TokenMeta = function (contractAddress) {
  let that = this;
  if (that.erc20TokenMeta[contractAddress]) {
    console.log('getEroc20Decimals from cached');
    return that.erc20TokenMeta[contractAddress];
  };
  var tokenContract = that.web3.eth.contract(abi.erc20).at(contractAddress);
  let decimals = tokenContract.decimals();
  let name = '';
  try {
    name = tokenContract.name();
  } catch (error) {}
  let symbol = '';
  try {
    symbol = tokenContract.symbol();
  } catch (error) {}
  let totalSupply = '';
  try {
    totalSupply = etherUnits.toERC20Token(tokenContract.totalSupply(), decimals);
  } catch (error) {}
  let tokenMeta = {
    name,
    decimals,
    symbol,
    totalSupply
  };
  that.erc20TokenMeta[contractAddress] = tokenMeta;
  return tokenMeta;
};

ERC20.prototype.balanceOf = function (contractAddress, address) {
  let that = this;
  let tokenContract = that.web3.eth.contract(abi.erc20).at(contractAddress);
  let balanceOf = tokenContract.balanceOf(address);
  let tokenMeta = that.getErc20TokenMeta(contractAddress);
  return {
    symbol: tokenMeta.symbol,
    amount: etherUnits.toERC20Token(balanceOf, tokenMeta.decimals)
  };
};

ERC20.prototype.estimateGas = function (options, callback) {
  let that = this;
  let tokenContract = that.web3.eth.contract(abi.erc20).at(options.contract);
  tokenContract.transfer.estimateGas(options.to, options.value, {
    from: options.from,
    nonce: options.nonce
  }, function (error, gasAmount) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, gasAmount);
    };
  });
};

ERC20.prototype.decodeInput = function (token, input) {
  let that = this;
  const decoder = new InputDataDecoder(abi.erc20);
  const result = decoder.decodeData(input);
  if (result.name) {
    let tokenMeta = that.getErc20TokenMeta(token);
    let amount = etherUnits.toERC20Token(result.inputs[1], tokenMeta.decimals);
    return {
      to: '0x'.concat(result.inputs[0]),
      value: amount,
      symbol: tokenMeta.symbol,
      token: token
    };
  } else {
    return null;
  };
};

module.exports = ERC20;