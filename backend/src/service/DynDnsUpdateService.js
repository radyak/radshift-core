const { promisify } = require('util')
const getIP = promisify(require('external-ip')())
const request = require('request')
var cron = require('node-cron')

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

  "godaddy": (config, externalIp) => {

    const hostDomain = process.env.HOST_DOMAIN
    const dynDnsProviderUsername = process.env.DYN_DNS_PROVIDER_USERNAME
    const dynDnsProviderPassword = process.env.DYN_DNS_PROVIDER_PASSWORD

    const url = `https://api.godaddy.com/v1/domains/${hostDomain}/records/A/*`

    var options = {
      method: 'PUT',
      url: url,
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

    return options
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
          console.log(
            `The external IP ${ipAdress} hasn't changed; nothing to do`
          )
          return
        }

        console.log(
          `The external IP has changed from ${
            state.previousExternalIP
          } to ${ipAdress}`
        )

        const dynDnsProvider = process.env.DYN_DNS_PROVIDER
        var options = DOMAIN_PROVIDER_REQUESTS[dynDnsProvider](ipAdress)

        request.get(options, (err, res, body) => {
          if (err) {
            console.error(err)
            state = {
              previousExternalIP: null,
              error: err
            }
            throw err
          }

          console.log('DynDNS server responded with: ', body)

          state = {
            previousExternalIP: ipAdress,
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
      console.log(`Started cyclic update every ${dynDnsUpdateIntervalMinutes} minute(s)`)
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
