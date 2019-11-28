let bip39 = require('bip39')
let hdwext = require('./hdwext')

function HdWallet() {}

HdWallet.prototype.result = function (status, data, code) {
  return {
    status: status, //bool
    data: data, //any
    code: code //int
  };
};

HdWallet.prototype.isEmpty = function (value) {
  return value == undefined || value == '';
};

HdWallet.prototype.generateMnemonic = function (mnemonicData) {
  let defaultData = {
    numWords: 15,
    rng: null
  };
  mnemonicData = Object.assign(defaultData, mnemonicData || {});
  if (mnemonicData.numWords < 12)
    return this.result(false, null, 2000);
  let strength = mnemonicData.numWords / 3 * 32;
  return this.result(true, bip39.generateMnemonic(strength, mnemonicData.rng).split(' ').join(','), 0);
};

HdWallet.prototype.validateMnemonic = function (mnemonicData) {
  let defaultData = {
    mnemonic: ''
  };
  mnemonicData = Object.assign(defaultData, mnemonicData || {});
  if (this.isEmpty(mnemonicData.mnemonic))
    return this.result(false, false, 2001);
  let data = bip39.validateMnemonic(mnemonicData.mnemonic.split(',').join(' '));
  return this.result(data, data, null);
};

HdWallet.prototype.generateAddresses = function (addressesData) {
  let defaultData = {
    mnemonic: '',
    passphrase: '',
    currency: '',
    purpose: 44,
    account: 0,
    change: 0,
    start: 0,
    end: 0
  };
  addressesData = Object.assign(defaultData, addressesData || {});
  if (this.isEmpty(addressesData.mnemonic))
    return this.result(false, null, 2001);
  if (this.isEmpty(addressesData.currency))
    return this.result(false, null, 2002);
  if (addressesData.start < 0)
    return this.result(false, null, 2003);
  if (addressesData.end < addressesData.start)
    return this.result(false, null, 2004);
  let mnemonic = addressesData.mnemonic.split(',').join(' ');
  let validate = this.validateMnemonic({
    mnemonic: mnemonic
  });
  if (!validate.status)
    return this.result(false, null, validate.code);
  let seedHex = bip39.mnemonicToSeedHex(mnemonic, addressesData.passphrase);
  let addresses = hdwext.generateAddresses(seedHex, addressesData.purpose, addressesData.currency, addressesData.account, addressesData.change, addressesData.start, addressesData.end);
  return this.result(true, addresses, null);
};

HdWallet.prototype.getWalletIdByMnemonic = function (mnemonicData) {
  let defaultData = {
    mnemonic: ''
  };
  mnemonicData = Object.assign(defaultData, mnemonicData || {});
  let addressesData = {
    mnemonic: mnemonicData.mnemonic,
    passphrase: 'WalletId',
    currency: 'btc',
    purpose: 44,
    account: 0,
    change: 0,
    start: 0,
    end: 0
  };
  let addressData = this.generateAddresses(addressesData);
  if (!addressData.status)
    return addressData;

  return this.result(true, addressData.data[0].address, null);
};

HdWallet.prototype.getAddressesByWalletId = function (mnemonicData) {
  let defaultData = {
    mnemonic: ''
  };
  mnemonicData = Object.assign(defaultData, mnemonicData || {});
  let addressesData = {
    mnemonic: mnemonicData.mnemonic,
    passphrase: 'WalletId',
    currency: 'btc',
    purpose: 44,
    account: 0,
    change: 0,
    start: 0,
    end: 0
  };
  let addressData = this.generateAddresses(addressesData);
  if (!addressData.status)
    return addressData;

  return this.result(true, addressData.data[0].address, null);
};

HdWallet.prototype.getXpubKeyByMnemonic = function (mnemonicData) {
  let defaultData = {
    mnemonic: '',
    passphrase: '',
    currency: 'btc',
    purpose: 44,
    account: 0
  };
  mnemonicData = Object.assign(defaultData, mnemonicData || {});
  if (this.isEmpty(mnemonicData.mnemonic))
    return this.result(false, null, 2001);

  let mnemonic = mnemonicData.mnemonic.split(',').join(' ');
  let validate = this.validateMnemonic({
    mnemonic: mnemonic
  });
  if (!validate.status)
    return this.result(false, null, validate.code);

  if (this.isEmpty(mnemonicData.currency))
    return this.result(false, null, 2002);

  let seedHex = bip39.mnemonicToSeedHex(mnemonic, mnemonicData.passphrase);
  let xpubKey = hdwext.getXpubKeyByMnemonic(seedHex, mnemonicData.currency, mnemonicData.purpose, mnemonicData.account);
  return this.result(true, xpubKey, null);
};

HdWallet.prototype.generateAddressesByXpubKey = function (xpubKeyData) {
  let defaultData = {
    xpubKey: '',
    currency: '',
    change: 0,
    start: 0,
    end: 0
  };
  xpubKeyData = Object.assign(defaultData, xpubKeyData || {});
  if (this.isEmpty(xpubKeyData.xpubKey))
    return this.result(false, null, 2006);
  if (this.isEmpty(xpubKeyData.currency))
    return this.result(false, null, 2002);
  if (xpubKeyData.start < 0)
    return this.result(false, null, 2003);
  if (xpubKeyData.end < xpubKeyData.start)
    return this.result(false, null, 2004);

  let addresses = hdwext.generateAddressesByXpubKey(xpubKeyData.xpubKey,
    xpubKeyData.currency,
    xpubKeyData.change,
    xpubKeyData.start,
    xpubKeyData.end);
  return this.result(true, addresses, null);
};

HdWallet.prototype.validateAddressByXpubKey = function (xpubKeyData) {
  let defaultData = {
    xpubKey: '',
    currency: '',
    change: 0,
    index: 0,
    address: ''
  };

  xpubKeyData = Object.assign(defaultData, xpubKeyData || {});
  if (this.isEmpty(xpubKeyData.xpubKey))
    return this.result(false, null, 2006);
  if (this.isEmpty(xpubKeyData.currency))
    return this.result(false, null, 2002);
  if (this.isEmpty(xpubKeyData.address))
    return this.result(false, null, 2007);
  if (xpubKeyData.change != 0 && xpubKeyData.change != 1)
    return this.result(false, null, 2008);
  if (xpubKeyData.index < 0)
    return this.result(false, null, 2009);

  let addresses = hdwext.generateAddressesByXpubKey(xpubKeyData.xpubKey,
    xpubKeyData.currency,
    xpubKeyData.change,
    xpubKeyData.index,
    xpubKeyData.index);

  let validate = addresses.length > 0 ? addresses[0] == xpubKeyData.address : false;
  return this.result(validate, validate, null);
};

HdWallet.prototype.generateAddressByWIF = function (wifData) {
  let defaultData = {
    wif: '',
    currency: '',
  };
  wifData = Object.assign(defaultData, wifData || {});
  if (this.isEmpty(wifData.wif))
    return this.result(false, null, 2010);
  if (this.isEmpty(wifData.currency))
    return this.result(false, null, 2002);

  let address = hdwext.generateAddressByWIF(wifData.currency, wifData.wif);
  return this.result(true, address, null);
};

HdWallet.prototype.generatePubkeyByWIF = function (wifData) {
  let defaultData = {
    wif: '',
    currency: '',
  };
  wifData = Object.assign(defaultData, wifData || {});
  if (this.isEmpty(wifData.wif))
    return this.result(false, null, 2010);
  if (this.isEmpty(wifData.currency))
    return this.result(false, null, 2002);

  let pubkey = hdwext.generatePubkeyByWIF(wifData.currency, wifData.wif);
  return this.result(true, pubkey, null);
};

HdWallet.prototype.validateAddress = function (addressData) {
  let defaultData = {
    address: '',
    currency: '',
  };
  addressData = Object.assign(defaultData, addressData || {});
  if (this.isEmpty(addressData.address))
    return this.result(false, null, 2007);
  if (this.isEmpty(addressData.currency))
    return this.result(false, null, 2002);

  let address = hdwext.validateAddress(addressData.currency, addressData.address);
  return this.result(true, address, null);
};

function HdHolder(_hdWallet) {
  this.hdWallet = _hdWallet;
};

hdHolder = new HdHolder(new HdWallet());

if (typeof window !== 'undefined') {
  window.hdWallet = hdHolder.hdWallet;
}

module.exports = hdHolder;