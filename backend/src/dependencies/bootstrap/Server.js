Provider('Server', (ConfigService, App) => {
  console.log('Using unsecured HTTP traffic - FOR DEVELOPMENT ONLY')

  var startPromise
  var server

  return {
    start: () => {
      startPromise = new Promise((resolve, reject) => {
        var port = process.env.PORT || 80
        server = App.listen(port, () => {
          console.log(`Server listening on port ${port}`)
          resolve({port: port})
        })
      })
    },
    stop: () => {
      startPromise.then((portConfig) => {
        console.log(`Stopping server`)
        server.close()
      })
    }
  }
})
