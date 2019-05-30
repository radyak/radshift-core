var express = require('express')
var router = express.Router()


Provider('BackendStoreRoutes', (BackendsService) => {

  router.get('/', (request, response) => {
    var filter = request.query.filter || ''
    BackendsService.getAllAvailable(filter).then((backends) => {
      response.status(200).send(backends)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.use('/*', (req, res, next) => {
      res.status(404).send()
  })

  return router
})
