const AppContext = require('./src/util/AppContext')


AppContext
  .scan([
    'src/dependencies'
  ])
  .start((Server, DynDns, Initializer) => {
    Initializer.run()
    Server.start()
    console.log(`Application started`)

    process.on('SIGHUP', () => {
      Server.stop()
    })
  })
