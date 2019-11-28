let erc20 = [{
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": false,
  "inputs": [{
    "name": "_spender",
    "type": "address"
  },
  {
    "name": "_value",
    "type": "uint256"
  }
  ],
  "name": "approve",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": false,
  "inputs": [{
    "name": "_from",
    "type": "address"
  },
  {
    "name": "_to",
    "type": "address"
  },
  {
    "name": "_value",
    "type": "uint256"
  }
  ],
  "name": "transferFrom",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "name": "",
    "type": "uint8"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [{
    "name": "_owner",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "name": "balance",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": false,
  "inputs": [{
    "name": "_to",
    "type": "address"
  },
  {
    "name": "_value",
    "type": "uint256"
  }
  ],
  "name": "transfer",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": true,
  "inputs": [{
    "name": "_owner",
    "type": "address"
  },
  {
    "name": "_spender",
    "type": "address"
  }
  ],
  "name": "allowance",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "payable": true,
  "stateMutability": "payable",
  "type": "fallback"
},
{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "owner",
    "type": "address"
  },
  {
    "indexed": true,
    "name": "spender",
    "type": "address"
  },
  {
    "indexed": false,
    "name": "value",
    "type": "uint256"
  }
  ],
  "name": "Approval",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "from",
    "type": "address"
  },
  {
    "indexed": true,
    "name": "to",
    "type": "address"
  },
  {
    "indexed": false,
    "name": "value",
    "type": "uint256"
  }
  ],
  "name": "Transfer",
  "type": "event"
}
];

let multiSignV2 = [{
  "constant": false,
  "inputs": [
    {
      "name": "sigV",
      "type": "uint8[]"
    },
    {
      "name": "sigR",
      "type": "bytes32[]"
    },
    {
      "name": "sigS",
      "type": "bytes32[]"
    },
    {
      "name": "bGeth",
      "type": "bool[]"
    },
    {
      "name": "destination",
      "type": "address"
    },
    {
      "name": "value",
      "type": "uint256"
    },
    {
      "name": "data",
      "type": "bytes"
    }
  ],
  "name": "execute",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "threshold",
  "outputs": [
    {
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "ownersArr",
  "outputs": [
    {
      "name": "",
      "type": "address"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "nonce",
  "outputs": [
    {
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "name": "threshold_",
      "type": "uint256"
    },
    {
      "name": "owners_",
      "type": "address[]"
    }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "payable": true,
  "stateMutability": "payable",
  "type": "fallback"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "name": "bGeth",
      "type": "bool"
    },
    {
      "indexed": false,
      "name": "txHash",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "name": "recovered",
      "type": "address"
    }
  ],
  "name": "Recovered",
  "type": "event"
}
];

module.exports = {
  erc20: erc20,
  multiSignV2: multiSignV2
};