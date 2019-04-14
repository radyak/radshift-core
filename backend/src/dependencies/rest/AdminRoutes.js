var express = require('express')
var router = express.Router()

Configuration('AdminRoutes', (ConfigService) => {
  
  router.get('/config', (req, res) => {
    ConfigService.getConfigSecure().then(config => {
      res.status(200).send(config)
    })
  })

  return router
})
