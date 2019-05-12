const { promisify } = require('util')
const getIP = promisify(require('external-ip')())
const request = require('request')
var cron = require('node-cron')

var state = {
  previousExternalIP: null,
  error: null
}

var cronJob = null

/**
 * Simple client to update DynDNS domains according to DynDNS protocol.
 * See https://help.dyn.com/remote-access-api/perform-update/
 */
class DynDnsUpdateService {
  /**
   *
   * @param {*} ConfigService
   */
  constructor (ConfigService) {
    this.configService = ConfigService
  }

  updateOnce () {
    Promise.all([this.configService.getConfig(), getIP()])
      .then(values => {
        const config = values[0]
        const EXTERNALIP = values[1]

        if (state.previousExternalIP === EXTERNALIP) {
          console.log(
            `The external IP ${EXTERNALIP} hasn't changed; nothing to do`
          )
          return
        }

        console.log(
          `The external IP has changed from ${
            state.previousExternalIP
          } to ${EXTERNALIP}`
        )

        var base64Credentials = Buffer.from(
          `${config.username}:${config.password}`
        ).toString('base64')

        const URL = `https://${config.dynDnsHost}/nic/update?hostname=${
          config.domain
        }&myip=${EXTERNALIP}`

        var options = {
          url: URL,
          headers: {
            'User-Agent': 'nodeclient',
            Host: config.dynDnsHost,
            Authorization: `Basic ${base64Credentials}`
          }
        }

        request.get(options, (err, res, body) => {
          if (err) {
            console.error(err)
            state = {
              previousExternalIP: null,
              error: err
            }
            throw err
          }

          console.log('DynDNS server responded with: ' + body)

          state = {
            previousExternalIP: EXTERNALIP,
            error: null
          }
        })
      })
      .catch(error => {
        console.error(error)
      })
    return this
  }

  updateCyclic () {
    this.configService.getConfig().then(config => {
      if (cronJob != null) {
        throw new Error(
          'A cyclic update is already running, cannot start another one'
        )
      }

      var cronExpression = `*/${config.updateIntervalMinutes} * * * *`
      cron.validate(cronExpression)

      cronJob = cron.schedule(
        cronExpression,
        () => {
          this.updateOnce()
        },
        {
          scheduled: false
        }
      )
      // Run first update immediately
      this.updateOnce()
      cronJob.start()
      console.log(`Started cyclic update every ${config.updateIntervalMinutes} minute(s)`)
    })
    return this
  }

  stopUpdateCyclic () {
    if (cronJob == null) {
      console.warn('Cannot stop cyclic update - none was started')
      return
    }
    cronJob.destroy()
    cronJob = null
    console.log(`Cyclic update stopped`)
    return this
  }
}

module.exports = DynDnsUpdateService
