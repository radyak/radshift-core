var expect = require('chai').expect
var PasswordHashService = require('../../src/service/PasswordHashService')

describe('PasswordHashService', function () {
  it('should hash and verify passwords', function () {
    var password = 'some-password'
    var hash = PasswordHashService.encrypt(password)

    expect(password).not.to.equal(hash)
    expect(PasswordHashService.check(password, hash)).to.equal(true)
  })
})
