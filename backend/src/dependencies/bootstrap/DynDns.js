const DynDnsUpdateService = require('../../service/DynDnsUpdateService')

Provider('DynDns', (ConfigService) => {
  return new DynDnsUpdateService(ConfigService).updateCyclic()
})

Provider('DynDns', (ConfigService) => {
  console.log('Environment is not production; no DynDNS required')
  return {
    updateOnce: () => {
      console.log('DynDns Mock: updateOnce')
    },
    updateCyclic: () => {
      console.log('DynDns Mock: updateCyclic')
    },
    stopUpdateCyclic: () => {
      console.log('DynDns Mock: stopUpdateCyclic')
    },
    restartUpdateCyclic: () => {
      console.log('DynDns Mock: restartUpdateCyclic')
    }
  }
}, 'dev')
