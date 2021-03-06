var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var path = require('path')


const STATIC_RESOURCES_PATH = '/usr/src/frontend'

Provider('App', (AuthRoutes, AdminRoutes, SystemRoutes, AuthMiddleware) => {

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
  app.use('/api/auth', AuthMiddleware.authenticatedOptional, AuthRoutes)
  app.use('/api/system', /*AuthMiddleware.hasPermission('admin'),*/ SystemRoutes)

  // Necessary for serving the complete Angular app, also under the different app routes
  app.use(express.static(STATIC_RESOURCES_PATH))
  app.use('/', express.static(STATIC_RESOURCES_PATH))
  app.use('/', (req, res) => {
    res.sendFile(path.resolve(`${STATIC_RESOURCES_PATH}/index.html`))
  })
  
  app.use('*', function (req, res) {
    res.status(404).send({
      message: 'Invalid URL'
    })
  })

  return app
})
