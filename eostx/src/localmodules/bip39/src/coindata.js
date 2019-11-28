/* https://github.com/libbitcoin/libbitcoin-system/issues/319 */
const Networks = {
  btc: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  btctest: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  vhkd: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x46,
    scriptHash: 0x49,
    wif: 0x80
  },
  ltc: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  },
  ltctest: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'tltc',
    bip32: {
      public: 0x0436f6e1,
      private: 0x0436ef7d
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xb0
  },
  btl: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x30,
    scriptHash: 0x05,
    wif: 0x80
  },
  bchabctest: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  bchabc: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  btgtest: {
    messagePrefix: '\x18Bitcoin Gold Signed Message:\n',
    bech32: 'tbtg',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  btg: {
    messagePrefix: '\x18Bitcoin Gold Signed Message:\n',
    bech32: 'btg',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x26,
    scriptHash: 0x17,
    wif: 0x80
  }
}

const CoinData = {
  btc: {
    coinType: 0,
    network: Networks.btc
  },
  btctest: {
    coinType: 1,
    network: Networks.btctest
  },
  eth: {
    coinType: 60,
    network: Networks.btc,
    chainId: 1
  },
  ethtest: {
    coinType: 60,
    network: Networks.btc,
    chainId: 4
  },
  etc: {
    coinType: 61,
    network: Networks.btc
  },
  xrp: {
    coinType: 144,
    network: Networks.btc
  },
  vhkd: {
    coinType: 999991,
    network: Networks.vhkd
  },
  vhkdtest: {
    coinType: 999991,
    network: Networks.vhkd
  },
  ltc: {
    coinType: 2,
    network: Networks.ltc
  },
  ltctest: {
    coinType: 2,
    network: Networks.ltctest
  },
  btl: {
    coinType: 999994,
    network: Networks.btl
  },
  btltest: {
    coinType: 999994,
    network: Networks.btl
  },
  bchabctest: {
    coinType: 145,
    network: Networks.bchabctest
  },
  bchabc: {
    coinType: 145,
    network: Networks.bchabc
  },
  btgtest: {
    coinType: 156,
    network: Networks.btgtest
  },
  btg: {
    coinType: 156,
    network: Networks.btg
  },
  vhkdio: {
    coinType: 999991,
    network: Networks.btc,
    chainId: 'afe97f023511453c09c64f5bb655e7f4dc6694685aff7231219964e9cc521585'
  },
  vhkdiotest: {
    coinType: 999991,
    network: Networks.btc,
    chainId: 'afe97f023511453c09c64f5bb655e7f4dc6694685aff7231219964e9cc521585'
  }
}

Object.freeze(CoinData);

module.exports = CoinData;