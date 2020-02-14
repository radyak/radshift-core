var express = require('express')
var router = express.Router()
var DockerApiClient = require('../interface/DockerApiClient')

const dockerApiClient = new DockerApiClient()


Provider('SystemRoutes', () => {
  
  router.get('/containers', (req, res) => {
    dockerApiClient.getAllContainerDetails()
    .then(containerDetails => {
      return containerDetails.map(containerDetail => containerDetail.Names[0].replace(/\//g, ''))
    })
    .then(containers => {
      res.status(200).send(containers)
    })
  })
  
  router.get('/containers/:name', (req, res) => {
    dockerApiClient.getContainerDetails(req.params.name).then(details => {
      res.status(200).send(details)
    })
  })
  
  router.get('/containers/:name/stats', (req, res) => {
    dockerApiClient.getContainerStats(req.params.name).then(stats => {
      res.status(200).send(stats)
    })
  })

  return router
})
