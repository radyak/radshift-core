var FileIO = require('./FileIO')
var CryptService = require('./CryptService')
var ObjectUtil = require('./ObjectUtil')
var deepmerge = require('deepmerge')

class ConfigService {

  constructor(configFile, keyProvider) {
    this.configFile = configFile
    this.keyProvider = keyProvider
    this.configCache = null

    // Encrypt config
    this.addConfig({}).then(() => {
      console.log('Using encrypted config')
    })
  }

  isJson(string) {
    try {
      JSON.parse(string)
    } catch (e) {
      return false
    }
    return true
  }

  readConfig () {
    return Promise.all([
      FileIO.read(this.configFile),
      this.keyProvider.get()
    ]).then(values => {
      var configString = values[0].toString('utf8')
      var key = values[1].toString('utf8')

      // Content was not encrypted, parse directly
      if (this.isJson(configString)) {
        return JSON.parse(configString)
      }

      // Content WAS encrypted, decrypt previously
      var cryptService = new CryptService({
        password: key
      })
      var decryptedConfigString = cryptService.decrypt(configString)
      if (this.isJson(decryptedConfigString)) {
        return JSON.parse(decryptedConfigString)
      }

      // Unreadable, since content was neither unencrypted nor decryptable with provided key
      throw new Error(`${this.configFile} is not JSON (${configString})`)
    })
  }

  getConfig() {
    var promise
    if (this.configCache === null) {
      promise = this.readConfig().then(config => {
        this.configCache = config
        return this.configCache
      })
    } else {
      promise = new Promise((resolve, reject) => {
        resolve(this.configCache)
      })
    }
    return promise
  }

  getConfigSecure() {
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

  addConfig(subConfig) {
    return Promise.all([this.getConfig(), this.keyProvider.get()]).then(
      values => {
        var config = values[0]
        var key = values[1].toString()
        this.configCache = deepmerge(config, subConfig)
        var cryptService = new CryptService({
          password: key
        })
        var encryptedResult = cryptService.encrypt(JSON.stringify(this.configCache))
        return FileIO.write(this.configFile, encryptedResult)
      }
    )
  }

}

module.exports = ConfigService
