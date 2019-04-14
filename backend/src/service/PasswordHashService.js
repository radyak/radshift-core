const passwordHash = require('password-hash')

module.exports = {

  encrypt: (password) => {
    return passwordHash.generate(password, {
      algorithm: 'sha256',
      saltLength: 10,
      iterations: 2
    })
  },

  check: (password, hash) => {
    return passwordHash.verify(password, hash)
  }

}
