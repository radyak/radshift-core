var FileIO = require('./FileIO')

function FileEnvKeyProvider (keyFile) {
  this.get = function () {
    return FileIO.read(keyFile)
  }
}

module.exports = FileEnvKeyProvider
