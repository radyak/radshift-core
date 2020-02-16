const DynDnsUpdateService = require('../../service/DynDnsUpdateService')
const Logger = require('../../logging/Logger')

Provider('DynDns', () => {
  return new DynDnsUpdateService().updateCyclic()
})

Provider('DynDns', () => {
  Logger.debug('Environment is not production; no DynDNS required')
  return {
    updateOnce: () => {
      Logger.debug('DynDns Mock: updateOnce')
    },
    updateCyclic: () => {
      Logger.debug('DynDns Mock: updateCyclic')
    },
    stopUpdateCyclic: () => {
      Logger.debug('DynDns Mock: stopUpdateCyclic')
    },
    restartUpdateCyclic: () => {
      Logger.debug('DynDns Mock: restartUpdateCyclic')
    },
    getCurrentIp: () => {
      Logger.debug('DynDns Mock: getIp')
      return '127.0.0.1'
    }
  }
}, 'dev')
