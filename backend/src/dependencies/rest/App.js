var express = require('express')
var app = express()
var bodyParser = require('body-parser')

Provider('App', (AuthRoutes, ApiProxyRoutes, AdminRoutes, BackendsRoutes) => {

  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  )
  
  app.use(bodyParser.raw())

  app.use('/api/isalive', function (req, res) {
    res.status(204).end()
  })

  app.use('/api/admin', bodyParser.json(), AdminRoutes)
  app.use('/api/backends', bodyParser.json(), BackendsRoutes)
  app.use('/api/auth', bodyParser.json(), AuthRoutes)

  app.use('/api', ApiProxyRoutes)

  app.use('/', express.static('/usr/src/frontend/dist/management'))

  app.use('*', function (req, res) {
    res.status(404).send({
      message: 'Invalid URL'
    })
  })

  return app
})
