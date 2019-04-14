var crypto = require('crypto')
var SimpleParamCheck = require('./SimpleParamCheck')

function CryptService (customConfig) {
  var CONFIG = Object.assign(
    {
      // algorithm: 'aes-256-ctr',
      algorithm: 'aes-256-cbc',
      password: null
    },
    customConfig
  )
  var key = Buffer.from(CONFIG.password, 'hex')
  var iv = Buffer.from(CONFIG.iv || '00000000000000000000000000000000', 'hex')

  SimpleParamCheck.checkForFalsy(CONFIG)

  this.encrypt = function (text) {
    // var cipher = crypto.createCipher(CONFIG.algorithm, CONFIG.password)

    var cipher = crypto.createCipheriv(CONFIG.algorithm, key, iv)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  }

  this.decrypt = function (text) {
    // var decipher = crypto.createDecipher(CONFIG.algorithm, CONFIG.password)
    var decipher = crypto.createDecipheriv(CONFIG.algorithm, key, iv)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  }
}

module.exports = CryptService
