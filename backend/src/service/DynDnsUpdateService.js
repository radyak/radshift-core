const { promisify } = require('util')
const getIP = promisify(require('external-ip')())
const request = require('request')
var cron = require('node-cron')

const Logger = require('../logging/Logger')

var state = {
  previousExternalIP: null,
  error: null
}


const DOMAIN_PROVIDER_REQUESTS = {

  "strato": (externalIp) => {

    const hostDomain = process.env.HOST_DOMAIN
    const dynDnsProviderUsername = process.env.DYN_DNS_PROVIDER_USERNAME
    const dynDnsProviderPassword = process.env.DYN_DNS_PROVIDER_PASSWORD

    var base64Credentials = Buffer.from(
      `${dynDnsProviderUsername}:${dynDnsProviderPassword}`
    ).toString('base64')

    const url = `https://dyndns.strato.com/nic/update?hostname=${hostDomain}&myip=${externalIp}`

    var options = {
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'nodeclient',
        Host: 'dyndns.strato.com',
        Authorization: `Basic ${base64Credentials}`
      }
    }

    return options
  },

  "godaddy": (externalIp) => {

    const hostDomain = process.env.HOST_DOMAIN
    const dynDnsProviderUsername = process.env.DYN_DNS_PROVIDER_USERNAME
    const dynDnsProviderPassword = process.env.DYN_DNS_PROVIDER_PASSWORD

    var optionsTemplate = {
      method: 'PUT',
      url: `https://api.godaddy.com/v1/domains/${hostDomain}/records/A/*`,
      json: true,
      body: [
        {
          "data": `${externalIp}`
        }
      ],
      headers: {
        Authorization: `sso-key ${dynDnsProviderUsername}:${dynDnsProviderPassword}`
      }
    }

    return [ 
      {
        ...optionsTemplate,
        url: `https://api.godaddy.com/v1/domains/${hostDomain}/records/A/*`
      },
      {
        ...optionsTemplate,
        url: `https://api.godaddy.com/v1/domains/${hostDomain}/records/A/@`
      },
    ]
  }

}

var cronJob = null

/**
 * Simple client to update DynDNS domains according to DynDNS protocol.
 * See https://help.dyn.com/remote-access-api/perform-update/
 */
class DynDnsUpdateService {

  constructor () {
  }

  updateOnce () {
    getIP()
      .then(ipAdress => {

        if (state.previousExternalIP === ipAdress) {
          Logger.debug(
            `The external IP ${ipAdress} hasn't changed; nothing to do`
          )
          return
        }

        Logger.info(
          `The external IP has changed from ${
            state.previousExternalIP
          } to ${ipAdress}`
        )

        const dynDnsProvider = process.env.DYN_DNS_PROVIDER
        var options = DOMAIN_PROVIDER_REQUESTS[dynDnsProvider](ipAdress)

        if (options.forEach) {
          options.forEach(option => {
            this.update(option)
          })
        } else {
          this.update(options)
        }
      })
      .catch(error => {
        Logger.error(error)
      })
    return this
  }

  update(options) {
    request(options, (err, res, body) => {
      if (err) {
        Logger.error(err)
        state = {
          previousExternalIP: null,
          error: err
        }
        throw err
      }

      Logger.info('DynDNS server responded with status', res.statusCode, body ? body : '')

      state = {
        previousExternalIP: ipAdress,
        error: null
      }
    })
  }

  updateCyclic () {
    if (cronJob != null) {
      throw new Error(
        'A cyclic update is already running, cannot start another one'
      )
    }

    const dynDnsUpdateIntervalMinutes = process.env.DYN_DNS_UPDATE_INTERVAL_MINUTES || 60
    var cronExpression = `*/${dynDnsUpdateIntervalMinutes} * * * *`
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
    Logger.info(`Started cyclic update every ${dynDnsUpdateIntervalMinutes} minute(s)`)
    return this
  }

  stopUpdateCyclic () {
    if (cronJob == null) {
      Logger.warn('Cannot stop cyclic update - none was started')
      return
    }
    cronJob.destroy()
    cronJob = null
    Logger.info(`Cyclic update stopped`)
    return this
  }
}

module.exports = DynDnsUpdateService
