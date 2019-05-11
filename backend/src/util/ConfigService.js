var FileIO = require('./FileIO')
var CryptService = require('./CryptService')
var ObjectUtil = require('./ObjectUtil')
var deepmerge = require('deepmerge')

function ConfigService (configFile, keyProvider) {
  var configCache = null

  var isJson = function (string) {
    try {
      JSON.parse(string)
    } catch (e) {
      return false
    }
    return true
  }

  var readConfig = function () {
    return Promise.all([
      FileIO.read(configFile),
      keyProvider.get()
    ]).then(values => {
      var configString = values[0].toString('utf8')
      var key = values[1].toString('utf8')

      // Content was not encrypted, parse directly
      if (isJson(configString)) {
        return JSON.parse(configString)
      }

      // Content WAS encrypted, decrypt previously
      var cryptService = new CryptService({
        password: key
      })
      var decryptedConfigString = cryptService.decrypt(configString)
      if (isJson(decryptedConfigString)) {
        return JSON.parse(decryptedConfigString)
      }

      // Unreadable, since content was neither unencrypted nor decryptable with provided key
      throw new Error(`${configFile} is not JSON (${configString})`)
    })
  }

  this.getConfig = function (hidePasswords) {
    var promise
    if (configCache === null) {
      promise = readConfig().then(config => {
        configCache = config
        return configCache
      })
    } else {
      promise = new Promise((resolve, reject) => {
        resolve(configCache)
      })
    }
    return promise
  }

  this.getConfigSecure = function () {
    return this.getConfig()
      .then(config => {
        return ObjectUtil.deepCopy(config)
      })
      .then(config => {
        ObjectUtil.traverse(config, (key, val, owner) => {
          if (/password/i.test(key)) {
            owner[key] = ''
          }
        })
        return config
      })
  }

  this.addConfig = function (subConfig) {
    return Promise.all([this.getConfig(), keyProvider.get()]).then(
      values => {
        var config = values[0]
        var key = values[1].toString()
        configCache = deepmerge(config, subConfig)
        var cryptService = new CryptService({
          password: key
        })
        var encryptedResult = cryptService.encrypt(JSON.stringify(configCache))
        return FileIO.write(configFile, encryptedResult)
      }
    )
  }

  // Encrypt config
  this.addConfig({}).then(() => {
    console.log('Using encrypted config')
  })
}

module.exports = ConfigService
