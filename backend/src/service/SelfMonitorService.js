const request = require('request')
const cron = require('node-cron')
const Logger = require('../logging/Logger')
const systeminformation = require('systeminformation')
const fs = require('fs')

var cronJob = null
const INTERVAL_MINUTES = 1

/**
 * Simple service to retrieve machine/host metrics
 */
class SelfMonitorService {

  constructor () {
  }

  update() {
    Promise.all([
      systeminformation.cpuCurrentspeed(),
      systeminformation.cpuTemperature(),
      systeminformation.mem(),
      systeminformation.fsSize(),
      systeminformation.currentLoad(),
      systeminformation.fullLoad(),
      systeminformation.processes(),
    ]).then(values => {
      var metrics = {
        cpuCurrentspeed: values[0],
        cpuTemperature: values[1],
        mem: values[2],
        // fsSize: values[3],
        currentLoad: values[4],
        fullLoad: values[5],
        processes: values[6]
      }
      delete metrics.processes.list
      this.log(metrics)
    })
  }

  updateCyclic() {
    if (cronJob != null) {
      throw new Error(
        'A cyclic update is already running, cannot start another one'
      )
    }

    var cronExpression = `*/${INTERVAL_MINUTES} * * * *`
    cron.validate(cronExpression)

    cronJob = cron.schedule(
      cronExpression,
      () => {
        this.update()
      },
      {
        scheduled: false
      }
    )
    cronJob.start()
    this.update()
    Logger.info(`Started monitoring. Measuring metrics every ${INTERVAL_MINUTES} minute(s)`)
    return this
  }

  stopUpdateCyclic() {
    if (cronJob == null) {
      Logger.warn('Cannot stop cyclic update - none was started')
      return
    }
    cronJob.destroy()
    cronJob = null
    Logger.info(`Cyclic update stopped`)
    return this
  }

  log(metrics) {
    let dir = process.env.SELFMONITOR_LOG_DIR || './log'
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    let date = new Date().toISOString()
    let filename = `${dir}/${date}.metrics.json`

    console.log('Current metrics:', metrics)
    
    let entry = {
      timestamp: date,
      metrics: metrics
    }

    fs.writeFile(filename, JSON.stringify(entry), () => {
      console.log(`Logged to ${filename}`)
    })
  }
}

module.exports = SelfMonitorService
