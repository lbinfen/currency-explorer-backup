var accumulative = require('./accumulative')
var blackjack = require('./blackjack')
var utils = require('./utils')
let BigNumber = require('bignumber.js');

// order by descending value, minus the inputs approximate fee
function utxoScore(x, feeRate) {
  return x.value - (feeRate * utils.inputBytes(x))
}

function coinSelect(utxos, outputs, feeRate, minFee, maxFee) {
  utxos = utxos.concat().sort(function (a, b) {
    return utxoScore(b, feeRate) - utxoScore(a, feeRate)
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack.blackjack(utxos, outputs, feeRate, minFee, maxFee)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative.accumulative(utxos, outputs, feeRate, minFee, maxFee)
}

// for vhkd
// order by descending value, minus the inputs approximate fee
function percentFeeUtxoScore(x, feeRate) {
  let fee = new BigNumber(x.value).times(feeRate).toNumber();
  return x.value - fee
}

// for vhkd
function percentFeeCoinSelect(utxos, outputs, feeRate, minFee, maxFee) {
  utxos = utxos.concat().sort(function (a, b) {
    return percentFeeUtxoScore(b, feeRate) - percentFeeUtxoScore(a, feeRate)
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack.percentFeeBlackjack(utxos, outputs, feeRate, minFee, maxFee)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative.percentFeeAccumulative(utxos, outputs, feeRate, minFee, maxFee)
}

// for btl
// order by descending value, minus the inputs approximate fee
function fixedFeeUtxoScore(x, fee) {
  return x.value - fee
}

// for btl
function fixedFeeCoinSelect(utxos, outputs, fee) {
  utxos = utxos.concat().sort(function (a, b) {
    return fixedFeeUtxoScore(b, fee) - fixedFeeUtxoScore(a, fee)
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack.fixedFeeBlackjack(utxos, outputs, fee)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative.fixedFeeAccumulative(utxos, outputs, fee)
}

module.exports = {
  coinSelect: coinSelect,
  percentFeeCoinSelect: percentFeeCoinSelect,
  fixedFeeCoinSelect: fixedFeeCoinSelect
}