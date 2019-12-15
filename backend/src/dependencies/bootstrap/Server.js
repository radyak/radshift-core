Provider('Server', (App, Logger) => {
  Logger.warn('Using unsecured HTTP traffic - FOR DEVELOPMENT ONLY')

  var startPromise
  var server

  return {
    start: () => {
      startPromise = new Promise((resolve, reject) => {
        var port = process.env.PORT || 80
        server = App.listen(port, () => {
          Logger.info(`Server listening on port ${port}`)
          resolve({port: port})
        })
      })
    },
    stop: () => {
      startPromise.then((portConfig) => {
        Logger.info(`Stopping server`)
        server.close()
      })
    }
  }
})
