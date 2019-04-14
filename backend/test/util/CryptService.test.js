var chai = require('chai')
var expect = chai.expect

var CryptService = require('../../src/util/CryptService')

var defaultConfig = {
  password: '313233342d73706163688aac77e4b30de03d308a5794577873a9193db5c84439'
}

describe('CryptService', function () {
  it('should throw error on initialization without password', function (done) {
    var cryptService
    try {
      cryptService = new CryptService({
        password: null
      })
      done(`Should not have been initialized with password 'null'`)
    } catch (err) {
      expect(cryptService).to.equal(undefined)
      done()
    }
  })

  it('should encrypt a string', function () {
    var cryptService = new CryptService(defaultConfig)
    var encrypted = cryptService.encrypt('string to be encrypted')
    expect(encrypted).to.be.equal(
      '0880b331cc1f2258a6e5f1c8c24a0edfd5b1fb0350bd2e98e174194ff4ea06a7'
    )
    var decrypted = cryptService.decrypt(encrypted)
    expect(decrypted).to.equal('string to be encrypted')
  })
})
