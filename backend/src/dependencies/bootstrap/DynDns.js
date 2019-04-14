const DynDnsUpdateService = require('../../service/DynDnsUpdateService')

Provider('DynDns', (config) => {
  return new DynDnsUpdateService(config).updateCyclic()
})

Provider('DynDns', (config) => {
  console.log('Environment is not production; no DynDNS required')
}, 'dev')
