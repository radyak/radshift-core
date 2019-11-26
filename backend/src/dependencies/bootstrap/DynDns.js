const DynDnsUpdateService = require('../../service/DynDnsUpdateService')

Provider('DynDns', () => {
  return new DynDnsUpdateService().updateCyclic()
})

Provider('DynDns', () => {
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
