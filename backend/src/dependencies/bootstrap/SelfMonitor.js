const SelfMonitorService = require('../../service/SelfMonitorService')

Provider('SelfMonitor', () => {
    let selfmonitor = new SelfMonitorService()
    return process.env.DISABLE_SELFMONITOR == "true" ? selfmonitor : selfmonitor.updateCyclic()
})
