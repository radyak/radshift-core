const njs = require('@radyak/njs')


njs
  .configure({
    useGlobals: true
  })
  .scan([
    'src/dependencies'
  ])
  .start((Server, DynDns, Initializer, SelfMonitor) => {
    Initializer.run()
    Server.start()
    console.log(`Application started`)

    process.on('SIGHUP', () => {
      Server.stop()
      DynDns.stopUpdateCyclic()
      SelfMonitor.stopUpdateCyclic()
    })
  })
