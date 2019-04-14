var fs = require('fs')

var FileIO = {
  read: function (file) {
    var promise = new Promise((resolve, reject) => {
      fs.readFile(file, (err, content) => {
        if (err) {
          reject(err)
          return
        }
        resolve(content)
      })
    })
    return promise
  },

  write: function (file, content) {
    var promise = new Promise((resolve, reject) => {
      fs.writeFile(file, content, err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
    return promise
  }
}

module.exports = FileIO
