const greenlock = require('greenlock-express')

Provider('Server', (ConfigService, App) => {
  return ConfigService.getConfig().then(config => {
    var server = greenlock.create({
      version: 'draft-11',
      server: 'https://acme-v02.api.letsencrypt.org/directory',
      configDir: '~/.config/acme/',
      email: config.adminEmail,
      approvedDomains: [config.hostDomain],
      agreeTos: true,
      app: App,
      communityMember: true,
      telemetry: false
    })

    return {
      start: () => {
        server.listen(80, 443)
        console.log(`Listening on ports 80, 443`)
      },
      stop: () => {
        console.log(`Stop not implemented for greenlock`)
      }
    }
  })
})


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
}, 'dev')
