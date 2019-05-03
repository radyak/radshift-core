var express = require('express')
var app = express()
// var session = require('express-session')
var bodyParser = require('body-parser')

Provider('App', (AuthRoutes, ApiProxyRoutes, AdminRoutes, BackendsRoutes, BackendStoreRoutes) => {

  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  )
  
  app.use(bodyParser.raw())

  app.use('/api/isalive', function (req, res) {
    res.status(204).end()
  })

  // TODO: Configurize
  // app.use(session({
  //   secret: 'abc123',
  //   cookie: { maxAge: 60000 },
  //   resave: false,
  //   saveUninitialized: false
  // }));

  app.use('/api/admin', bodyParser.json(), AdminRoutes)
  app.use('/api/backends', bodyParser.json(), BackendsRoutes)
  app.use('/api/store', bodyParser.json(), BackendStoreRoutes)
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
