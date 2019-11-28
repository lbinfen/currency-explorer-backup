const CoinData = require("./coindata");
const bitcoin = require('bitcoinforksjs-lib')
const basex = require('base-x')
const ethUtil = require('ethereumjs-util');
const ethCrypto = require('eth-crypto');
const bchaddr = require('bchaddrjs');
const ecc = require('eosjs-ecc');

function parseIntNoNaN(val, defaultVal) {
  let v = parseInt(val);
  if (isNaN(v)) {
    return defaultVal;
  }
  return v;
}

function getDerivationPath(purpose, coinType, account, change) {
  purpose = parseIntNoNaN(purpose, 44);
  coinType = parseIntNoNaN(coinType, 0);
  account = parseIntNoNaN(account, 0);
  change = parseIntNoNaN(change, 0);
  let derivationPath = `m/${purpose}'/${coinType}'/${account}'/${change}`;
  return derivationPath;
}

function getBIP32DerivationPath() {
  let derivationPath = 'm';
  return derivationPath;
}

function calcBip32RootKeyFromSeed(seedHex, network) {
  let bip32RootKey = bitcoin.HDNode.fromSeedHex(seedHex, network);
  return bip32RootKey;
}

function calcBip32ExtendedKey(seedHex, network, path) {
  let extendedKey = calcBip32RootKeyFromSeed(seedHex, network);
  // Derive the key from the path
  let pathBits = path.split("/");
  for (let i = 0; i < pathBits.length; i++) {
    let bit = pathBits[i];
    let index = parseInt(bit);
    if (isNaN(index)) {
      continue;
    }
    let hardened = bit[bit.length - 1] == "'";
    let isPriv = !(extendedKey.isNeutered());
    let invalidDerivationPath = hardened && !isPriv;
    if (invalidDerivationPath) {
      extendedKey = null;
    } else if (hardened) {
      extendedKey = extendedKey.deriveHardened(index);
    } else {
      extendedKey = extendedKey.derive(index);
    }
  }
  return extendedKey
}

function convertRippleAdrr(address) {
  return basex('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz').encode(
    basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(address)
  )
}

function convertRipplePriv(priv) {
  return basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(priv).toString("hex").slice(2, 66)
}

function isLikeEthereum(currency) {
  let list = ['eth', 'etc', 'pirl', 'mix', 'music', 'poa', 'exp', 'clo'];
  return list.includes(currency) || list.map(x => x.concat('test')).includes(currency);
}

function isBCH(currency) {
  return currency == 'bchabc' || currency == 'bchabctest';
}

function isVHKDIO(currency) {
  return currency == 'vhkdio' || currency == 'vhkdiotest';
}

function isSegwit(purpose) {
  return purpose == 49 || purpose == 84 || purpose == 141;
}

function getXpubKeyByMnemonic(seedHex, currency, purpose, account) {
  let coinData = CoinData[currency];
  let extendedKey = calcBip32RootKeyFromSeed(seedHex, coinData.network);
  let path = `m/${purpose}'/${coinData.coinType}'/${account}'`;
  let account0 = extendedKey.derivePath(path);
  let xpubString = account0.neutered().toBase58();
  return xpubString;
}

function generateAddressesByXpubKey(xpubKey, currency, change, start, end) {
  let coinData = CoinData[currency];
  let address0FromXpub = bitcoin.HDNode.fromBase58(xpubKey, coinData.network);
  let addresses = [];
  for (let index = start; index <= end; index++) {
    let address = address0FromXpub.neutered().derivePath(`${change}/${index}`).keyPair.getAddress();
    addresses.push(address);
  }
  return addresses;
}

function calcBip32ExtendedPublicKey(seedHex, purpose, currency, account) {
  let coinData = CoinData[currency];
  let derivationPath = getBIP32DerivationPath(purpose, coinData.coinType, account);
  let bip32ExtendedKey = calcBip32ExtendedKey(seedHex, coinData.network, derivationPath);
  return bip32ExtendedKey.neutered().toBase58();
}

function generateAddresses(seedHex, purpose, currency, account, change, start, end) {
  let coinData = CoinData[currency];
  let derivationPath = getDerivationPath(purpose, coinData.coinType, account, change);
  let bip32ExtendedKey = calcBip32ExtendedKey(seedHex, coinData.network, derivationPath);
  let addresses = [];
  for (let index = start; index <= end; index++) {
    // derive HDkey for this row of the table
    let key = bip32ExtendedKey.derive(index);
    let keyPair = key.keyPair;
    // get pubkey
    let pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    // get address
    let address = keyPair.getAddress().toString();
    // get privkey
    let hasPrivkey = !key.isNeutered();
    let privkey = "NA";
    let legacyAddress = null;
    let bitpayAddress = null;
    if (hasPrivkey) {
      privkey = keyPair.toWIF();
    }
    let path = derivationPath + "/" + index;
    // Ethereum values are different
    if (isLikeEthereum(currency)) {
      let privKeyBuffer = keyPair.d.toBuffer(32);
      privkey = privKeyBuffer.toString('hex');
      let addressBuffer = ethUtil.privateToAddress(privKeyBuffer);
      let hexAddress = addressBuffer.toString('hex');
      let checksumAddress = ethUtil.toChecksumAddress(hexAddress);
      address = ethUtil.addHexPrefix(checksumAddress);
      privkey = ethUtil.addHexPrefix(privkey);
      pubkey = ethUtil.addHexPrefix(pubkey);
    }
    if (isVHKDIO(currency)) {
      let privKeyBuffer = keyPair.d.toBuffer(32);
      let privateKeyObj = ecc.PrivateKey(privKeyBuffer);
      address = '';
      privkey = privateKeyObj.toWif();
      pubkey = privateKeyObj.toPublic().toString('VHKD');
    }
    // Ripple values are different
    if (currency == "xrp" || currency == "xrptest") {
      privkey = convertRipplePriv(privkey);
      address = convertRippleAdrr(address);
    }
    // Bitcoin Cash address format may lety
    if (isBCH(currency)) {
      address = bchaddr.toCashAddress(address);
      legacyAddress = bchaddr.toLegacyAddress(address);
      bitpayAddress = bchaddr.toBitpayAddress(address);
    }
    // Segwit addresses are different
    if (isSegwit(purpose)) {
      //TODO: which kind is better?
      let isP2wpkh = false;
      let isP2wpkhInP2sh = true;
      if (isP2wpkh) {
        let keyhash = bitcoin.crypto.hash160(key.getPublicKeyBuffer());
        let scriptpubkey = bitcoin.script.witnessPubKeyHash.output.encode(keyhash);
        address = bitcoin.address.fromOutputScript(scriptpubkey, coinData.network)
      } else if (isP2wpkhInP2sh) {
        let keyhash = bitcoin.crypto.hash160(key.getPublicKeyBuffer());
        let scriptsig = bitcoin.script.witnessPubKeyHash.output.encode(keyhash);
        let addressbytes = bitcoin.crypto.hash160(scriptsig);
        let scriptpubkey = bitcoin.script.scriptHash.output.encode(addressbytes);
        address = bitcoin.address.fromOutputScript(scriptpubkey, coinData.network)
      }
    }
    let item = {
      path,
      address,
      pubkey,
      privkey
    }
    if (legacyAddress) {
      item.legacyAddress = legacyAddress;
    }
    if (bitpayAddress) {
      item.bitpayAddress = bitpayAddress;
    }
    addresses.push(item);
  }

  return addresses;
}

function generateAddressByWIF(currency, privateKey) {
  let coinData = CoinData[currency];
  if (isLikeEthereum(currency)) {
    let addressBuffer = ethUtil.privateToAddress(privateKey);
    let hexAddress = addressBuffer.toString('hex');
    let checksumAddress = ethUtil.toChecksumAddress(hexAddress);
    let address = ethUtil.addHexPrefix(checksumAddress);
    return address;
  } else {
    const keyPair = new bitcoin.ECPair.fromWIF(privateKey, coinData.network);
    let address = keyPair.getAddress().toString();
    return address;
  }
}

function generatePubkeyByWIF(currency, privateKey) {
  let coinData = CoinData[currency];
  if (isLikeEthereum(currency)) {
    let pubkey = ethCrypto.publicKeyByPrivateKey(privateKey);
    pubkey = ethCrypto.publicKey.compress(pubkey);
    pubkey = ethUtil.addHexPrefix(pubkey);
    return pubkey;
  } else if (isVHKDIO(currency)) {
    let privateKeyObj = ecc.PrivateKey(privateKey);
    let pubkey = privateKeyObj.toPublic().toString('VHKD');
    return pubkey;
  } else {
    const keyPair = new bitcoin.ECPair.fromWIF(privateKey, coinData.network);
    let pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    return pubkey;
  }
}

function validateAddress(currency, address) {
  try {
    if (isLikeEthereum(currency)) {
      return ethUtil.isValidAddress(address);
    } else {
      if (isBCH(currency)) {
        address = bchaddr.toLegacyAddress(address);
      }
      let coinData = CoinData[currency];
      let os = bitcoin.address.toOutputScript(address, coinData.network);
      return true;
    }
  } catch (error) {
    return false;
  };
}

module.exports = {
  generateAddresses: generateAddresses,
  calcBip32ExtendedPublicKey: calcBip32ExtendedPublicKey,
  getXpubKeyByMnemonic: getXpubKeyByMnemonic,
  generateAddressesByXpubKey: generateAddressesByXpubKey,
  generateAddressByWIF: generateAddressByWIF,
  generatePubkeyByWIF: generatePubkeyByWIF,
  validateAddress: validateAddress
}