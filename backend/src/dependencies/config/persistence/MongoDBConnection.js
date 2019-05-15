var mongoose = require('mongoose')

Provider('MongoDBConnection', (ConfigService) => {
  return ConfigService.getConfig().then((config) => {
    // TODO: fetch props from config, not (only) from Env
    const HOST = process.env.MONGO_HOST || 'localhost'
    const PORT = process.env.MONGO_PORT || '27017'
    const DATABASE = process.env.MONGO_DATABASE || 'core'

    var connectString = `mongodb://${HOST}:${PORT}/${DATABASE}`

    return mongoose
      .connect(connectString, { useNewUrlParser: true })
      .then(
        res => {
          console.log(`Successfully connected to ${connectString}`)
          return mongoose
        },
        err => {
          console.error(`Unable to connected to ${connectString}`, err)
          throw err
        }
      )
  })
})
