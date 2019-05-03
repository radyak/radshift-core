var mongoose = require('mongoose')

Provider('MongoDBConnection', (config) => {
  return new Promise((resolve, reject) => {
    // TODO: fetch props from config, not (only) from Env
    const HOST = process.env.MONGO_HOST || 'localhost'
    const PORT = process.env.MONGO_PORT || '27017'
    const DATABASE = process.env.MONGO_DATABASE || 'core'

    var connectString = `mongodb://${HOST}:${PORT}/${DATABASE}`

    mongoose
      .connect(connectString, { useNewUrlParser: true })
      .then(
        res => {
          console.log(`Successfully connected to ${connectString}`)
          resolve(mongoose)
        },
        err => {
          console.error(`Unable to connected to ${connectString}`, err)
          reject(err)
        }
      )
  })
})
