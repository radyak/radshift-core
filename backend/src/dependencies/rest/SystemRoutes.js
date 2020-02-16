var express = require('express')
var router = express.Router()
const systeminformation = require('systeminformation');


Provider('SystemRoutes', (DynDns) => {
    
  router.get('/', (req, res) => {
    systeminformation.system().then(info => res.status(200).send(info))
  })
    
  router.get('/time', (req, res) => {
    res.status(200).send(systeminformation.time())
  })
    
  router.get('/cpu', (req, res) => {
    Promise.all([
      systeminformation.cpuCurrentspeed(),
      systeminformation.cpuTemperature(),
    ])
    .then(info => res.status(200).send({
      speed: info[0],
      temperature: info[1],
    }))
  })
    
  router.get('/memory', (req, res) => {
    systeminformation.mem().then(info => res.status(200).send(info))
  })
    
  router.get('/space', (req, res) => {
    systeminformation.fsSize().then(info => res.status(200).send(info))
  })

  router.get('/load', (req, res) => {
    Promise.all([
      systeminformation.currentLoad(),
      systeminformation.fullLoad(),
      systeminformation.processes(),
    ])
    .then(info => res.status(200).send({
      currentLoad: info[0],
      fullLoad: info[1],
      processes: info[2],
    }))
  })
  
  router.get('/containers', (req, res) => {
    systeminformation.dockerAll().then(info => res.status(200).send(info))
  })
    
  router.get('/network', (req, res) => {
    res.status(200).send({
      ip: DynDns.getCurrentIp()
    })
  })

  return router
})
