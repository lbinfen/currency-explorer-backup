function respond(req, res, err, result) {
  if (err) debug('ERR: ' + req.path, err)
  if (err) {
    let errMsg
    if (typeof err === 'number') {
      res.status(err)
    } else {
      if (typeof err === 'object' && err.message) {
        res.status((err.status && typeof err.status === 'number') ? err.status : 400)
        errMsg = '' + err.message
      } else {
        res.status(400)
        errMsg = '' + err
      }
    }
    res.json({
      error: errMsg
    })
    return res.end()
  }

  res.status(200)
  if (result !== undefined) {
    if (typeof result === 'string') res.send(result)
    else if (Buffer.isBuffer(result)) res.send(result)
    else res.json(result)
  }
  res.end()
};

module.exports = respond;