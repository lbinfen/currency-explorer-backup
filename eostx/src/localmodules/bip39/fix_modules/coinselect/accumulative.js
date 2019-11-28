var utils = require('./utils')
let BigNumber = require('bignumber.js');

// add inputs until we reach or surpass the target value (or deplete)
// worst-case: O(n)
function accumulative(utxos, outputs, feeRate, minFee, maxFee) {
  if (!isFinite(utils.uintOrNaN(feeRate)) && !minFee) return {}
  var bytesAccum = utils.transactionBytes([], outputs)

  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)

  for (var i = 0; i < utxos.length; ++i) {
    var utxo = utxos[i]
    var utxoBytes = utils.inputBytes(utxo)

    if (feeRate == 0) {
      feeRate = utils.calFeeRate(minFee, utxoBytes);
    }

    var utxoFee = feeRate * utxoBytes

    if (maxFee && maxFee > 0 && utxoFee > maxFee) {
      feeRate = utils.calFeeRate(maxFee, utxoBytes);
      utxoFee = maxFee;
    } else if (minFee && minFee > 0 && utxoFee < minFee) {
      feeRate = utils.calFeeRate(minFee, utxoBytes);
      utxoFee = minFee;
    }

    var utxoValue = utils.uintOrNaN(utxo.value)

    // skip detrimental input
    if (utxoFee > utxo.value) {
      if (i === utxos.length - 1) return {
        fee: feeRate * (bytesAccum + utxoBytes)
      }
      continue
    }

    bytesAccum += utxoBytes
    inAccum += utxoValue
    inputs.push(utxo)

    var fee = feeRate * bytesAccum

    if (maxFee && maxFee > 0 && fee > maxFee) {
      feeRate = utils.calFeeRate(maxFee, bytesAccum);
      fee = maxFee;
    } else if (minFee && minFee > 0 && fee < minFee) {
      feeRate = utils.calFeeRate(minFee, bytesAccum);
      fee = minFee;
    }

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, feeRate)
  }

  return {
    fee: feeRate * bytesAccum
  }
}

// for vhkd
// add inputs until we reach or surpass the target value (or deplete)
// worst-case: O(n)
function percentFeeAccumulative(utxos, outputs, feeRate, minFee, maxFee) {
  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)
  let fee = utils.calfee(outAccum, feeRate, minFee, maxFee)
  //let fee = new BigNumber(outAccum).times(feeRate).integerValue(0).toNumber();

  for (var i = 0; i < utxos.length; ++i) {
    var utxo = utxos[i]
    var utxoValue = utils.uintOrNaN(utxo.value)

    // skip detrimental input
    if (fee > utxo.value) {
      if (i === utxos.length - 1) return {
        fee: fee
      }
      continue
    }

    inAccum += utxoValue
    inputs.push(utxo)

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.feefinalize(inputs, outputs, fee)
  }

  return {
    fee: fee
  }
}

// for btl
// add inputs until we reach or surpass the target value (or deplete)
// worst-case: O(n)
function fixedFeeAccumulative(utxos, outputs, fee) {
  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)

  for (var i = 0; i < utxos.length; ++i) {
    var utxo = utxos[i]
    var utxoValue = utils.uintOrNaN(utxo.value)

    // skip detrimental input
    if (fee > utxo.value) {
      if (i === utxos.length - 1) return {
        fee: fee
      }
      continue
    }

    inAccum += utxoValue
    inputs.push(utxo)

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.feefinalize(inputs, outputs, fee)
  }

  return {
    fee: fee
  }
}

module.exports = {
  accumulative: accumulative,
  percentFeeAccumulative: percentFeeAccumulative,
  fixedFeeAccumulative: fixedFeeAccumulative
}