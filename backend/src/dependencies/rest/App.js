var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

Provider('App', (AuthRoutes, AdminRoutes, BackendsRoutes, BackendStoreRoutes, AuthMiddleware) => {

  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  )  
  // app.use(bodyParser.raw())

  app.use(bodyParser.json())

  app.use(cookieParser());

  app.use('/api/isalive', function (req, res) {
    res.status(204).end()
  })

  app.use('/api/admin', AuthMiddleware.hasPermission('admin'), AdminRoutes)
  app.use('/api/backends', AuthMiddleware.authenticated, BackendsRoutes)
  app.use('/api/store', AuthMiddleware.authenticated, BackendStoreRoutes)
  app.use('/api/auth', AuthRoutes)

  app.use('/', express.static('/usr/src/frontend/dist/management'))

  app.use('*', function (req, res) {
    res.status(404).send({
      message: 'Invalid URL'
    })
  })

  return app
})
