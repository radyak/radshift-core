var express = require('express')
var router = express.Router()


Configuration('BackendStoreRoutes', (BackendsService) => {

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

  return router
})
