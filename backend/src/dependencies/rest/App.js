var express = require('express')
var app = express()
var bodyParser = require('body-parser')

Provider('App', (AuthRoutes, ApiProxyRoutes, AdminRoutes, BackendsRoutes, BackendStoreRoutes, AuthMiddleware) => {

  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  )
  
  app.use(bodyParser.raw())

  app.use('/api/isalive', function (req, res) {
    res.status(204).end()
  })

  app.use('/api/admin', bodyParser.json(), AuthMiddleware.hasPermission('admin'), AdminRoutes)
  app.use('/api/backends', bodyParser.json(), AuthMiddleware.authenticated, BackendsRoutes)
  app.use('/api/store', bodyParser.json(), AuthMiddleware.authenticated, BackendStoreRoutes)
  app.use('/api/auth', bodyParser.json(), AuthRoutes)

  app.use('/apps', AuthMiddleware.backendForwarding, ApiProxyRoutes)

  app.use('/', express.static('/usr/src/frontend/dist/management'))

  app.use('*', function (req, res) {
    res.status(404).send({
      message: 'Invalid URL'
    })
  })

  return app
})
