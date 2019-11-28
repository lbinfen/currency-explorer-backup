const abi = require('./abi.js');
const CoinData = require("./coindata");
const Web3 = require('web3');
const web3 = new Web3();
const EthereumTx = require('ethereumjs-tx')
const Wallet = require('ethereumjs-wallet');
var BigNumber = require('bignumber.js');
const ethCrypto = require('eth-crypto');

class ECoin {
  constructor() {}

  result(status, data, code) {
    return {
      status: status, //bool
      data: data, //any
      code: code //int
    };
  }

  isEmpty(value) {
    return value == undefined || value == '';
  }

  formatHex(hex) {
    if (hex.substr(0, 2) == '0x') {
      hex = hex.substr(2);
    };
    return hex;
  }

  decryptKeyStore(keyStoreData) {
    let defaultData = {
      currency: '',
      password: ''
    };
    keyStoreData = Object.assign(defaultData, keyStoreData || {});

    if (this.isEmpty(keyStoreData.currency))
      return this.result(false, null, 2002);

    if (!defaultData.keyStoreJSON || this.isEmpty(defaultData.keyStoreJSON))
      return this.result(false, false, 2019);

    if (typeof (keyStoreData.keyStoreJSON) == 'object') {
      keyStoreData.keyStoreJSON = JSON.stringify(keyStoreData.keyStoreJSON);
    };

    let wallet = Wallet.fromV3(keyStoreData.keyStoreJSON, keyStoreData.password)
    let address = wallet.getAddressString();
    let privateKey ='0x'.concat(wallet.getPrivateKey().toString('hex'));
    return this.result(true, {
      address: address,
      privateKey: privateKey
    }, 0);
  }

  exportKeyStore(accountData) {
    let defaultData = {
      currency: '',
      privateKey: '',
      password: '',
    };
    accountData = Object.assign(defaultData, accountData || {});

    if (this.isEmpty(accountData.currency))
      return this.result(false, null, 2002);

    if (this.isEmpty(accountData.privateKey))
      return this.result(false, null, 2020);

    let privateKey = this.formatHex(accountData.privateKey);
    let privateKeyData = Buffer.from(privateKey, 'hex');
    let wallet = Wallet.fromPrivateKey(privateKeyData);
    let keyStoreJSON = wallet.toV3String(accountData.password);
    return this.result(true, keyStoreJSON, 0);
  }

  signTransaction(tranData) {
    let defaultData = {
      currency: '',
      to: '',
      value: '',
      tokenContract: '',
      tokenDecimals: 0,
      gasPrice: '',
      gas: 0,
      chainId: 4,
      nonce: 0,
      privateKey: ''
    };
    tranData = Object.assign(defaultData, tranData || {});

    if (this.isEmpty(tranData.currency))
      return this.result(false, null, 2002);

    if (this.isEmpty(tranData.privateKey))
      return this.result(false, null, 2020);

    if (this.isEmpty(tranData.to))
      return this.result(false, false, 2017);

    if (this.isEmpty(tranData.value))
      return this.result(false, false, 2018);

    if (this.isEmpty(tranData.gas))
      return this.result(false, false, 2021);

    if (this.isEmpty(tranData.gasPrice))
      return this.result(false, false, 2022);

    let coinData = CoinData[tranData.currency];
    tranData.chainId = coinData.chainId;

    const txParams = {
      nonce: web3.toHex(tranData.nonce),
      gasPrice: web3.toHex(web3.toWei(tranData.gasPrice, "gwei")),
      gasLimit: web3.toHex(tranData.gas),
      to: tranData.to,
      chainId: coinData.chainId
    };

    if (this.isEmpty(tranData.tokenContract)) {
      txParams.value = web3.toHex(web3.toWei(tranData.value, "ether"));
    } else {
      /*
      let tokenContract = new web3.eth.Contract(abi.erc20, tranData.contract);
      let decimals = tokenContract.methods.decimals.call();
      let value = new BigNumber(tranData.value).toString(10) * (Math.pow(10, decimals.toString(10)));
      let data = tokenContract.methods.transfer(tranData.to, value).encodeABI();
      console.log('111111111111111111');
      console.log(data);
      */
      let tokenContract = web3.eth.contract(abi.erc20).at(tranData.contract);
      let value = new BigNumber(tranData.value).times(Math.pow(10, tranData.tokenDecimals)).toString(10);
      /*
      console.log(''.concat(tranData.value,'*',tranData.tokenDecimals));
      console.log('trace bignumber bug');
      console.log(value);
      */
      let data = tokenContract.transfer.getData(tranData.to, value);
      txParams.data = data;
      txParams.value = web3.toHex(0);
      txParams.to = tranData.tokenContract;
    };
    //console.log(txParams);
    const tx = new EthereumTx(txParams);
    if (tranData.privateKey.substr(0, 2) == '0x') {
      tranData.privateKey = tranData.privateKey.substr(2);
    };
    let privateKey = new Buffer(tranData.privateKey, 'hex')
    tx.sign(privateKey);
    const serializedTx = '0x'.concat(tx.serialize().toString('hex'));
    return this.result(true, serializedTx, 0);
  }

  signMultisigTransaction(txData){
    let defaultData = {
      hash: '',
      key: ''
    };
    txData = Object.assign(defaultData, txData || {});
    
    if (this.isEmpty(txData.hash))
      return this.result(false, false, 2023);

    if (this.isEmpty(txData.key))
      return this.result(false, false, 2024);

    let signature = ethCrypto.sign(txData.key, txData.hash);
    return this.result(true, signature, 0);
  }

}

function ECoinHolder(_ecoin) {
  this.ecoin = _ecoin;
};

ecoinHolder = new ECoinHolder(new ECoin());
if (typeof window !== 'undefined') {
  window.ecoin = ecoinHolder.ecoin;
}
module.exports = ecoinHolder;