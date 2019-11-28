const abi = require('./abi.js');
const InputDataDecoder = require('ethereum-input-data-decoder');

function MultiSignV2() {

}

MultiSignV2.prototype.decodeInput = function (input) {
  const decoder = new InputDataDecoder(abi.multiSignV2);
  const result = decoder.decodeData(input);
  if (result.name) {
    return {
      destination: '0x'.concat(result.inputs[4]),
      value: '0x'.concat(result.inputs[5].toString(16)),
      data: '0x'.concat(result.inputs[6].toString('hex'))
    };
  } else {
    return null;
  };
};

module.exports = MultiSignV2;