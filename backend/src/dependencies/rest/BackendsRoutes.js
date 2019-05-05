var express = require('express')
var router = express.Router()


Configuration('BackendsRoutes', (BackendsService) => {

  router.get('/', (request, response) => {
    BackendsService.getAll().then((backends) => {
      response.status(200).send(backends)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.get('/:name', (request, response) => {
    const name = request.params.name
    BackendsService.get(name).then((backend) => {
      if (!backend) {
        response.status(404).send({
          message: `Backend ${name} not found`
        })
        return
      }
      response.status(200).send(backend)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.get('/:name/metrics', (request, response) => {
    const name = request.params.name
    BackendsService.metrics(name).then((metrics) => {
      if (!metrics) {
        response.status(404).send({
          message: `Backend ${name} not found`
        })
        return
      }
      response.status(200).send(metrics)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.delete('/:name', (request, response) => {
    const name = request.params.name
    BackendsService.remove(name).then((result) => {
      if (result === null) {
        response.status(404).send({
          message: `Backend ${name} not found`
        })
        return
      }
      response.status(204).send()
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name/stop', (request, response) => {
    const name = request.params.name
    BackendsService.stop(name).then((backend) => {
      if (backend === null) {
        response.status(404).send({
          message: `Backend ${name} not found`
        })
        return
      }
      response.status(200).send(backend)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name/start', (request, response) => {
    const name = request.params.name
    BackendsService.start(name).then((backend) => {
      if (backend === null) {
        response.status(404).send({
          message: `Backend ${name} not found`
        })
        return
      }
      response.status(200).send(backend)
    }).catch((err) => {
      response.status(500).send({
        message: `An error occurred`,
        error: err
      })
    })
  })

  router.post('/:name', (request, response) => {
    const name = request.params.name
    BackendsService.create(name, (data) => {
      console.log(data)
    }).then(() => {
      response.status(204).send()
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
