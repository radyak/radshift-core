var express = require('express')
var router = express.Router()
var fs = require('fs')
const systeminformation = require('systeminformation');


let getBackupStatus = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`/backup/backup.status`, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(JSON.parse(data.toString()))
    })
  })
}

let getBackupLog = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`/backup/backup.log`, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data.toString())
    })
  })
}



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
    
  router.get('/backup', (req, res) => {
    Promise.all([
      getBackupStatus(),
      getBackupLog()
    ]).then(val => {
      let status = val[0]
      let log = val[1]
      res.status(200).send({
        status: status.status,
        date: status.date,
        log: log
      })
    }, err => {
      res.status(500).send(err)
    })
  })

  return router
})
