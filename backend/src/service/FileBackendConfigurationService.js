const path = require('path')

var config

class FileBackendConfigurationService {

    constructor() {
    }

    getBackendConfigurations() {
        if (!config) {
            let confDir = path.resolve(process.env.CONF_DIR)
            config = require(`${confDir}/backends-config.json`)
        }
        return config
    }

    getBackendConfiguration(name) {
        return this.getBackendConfigurations()[name]
    }

}

module.exports = FileBackendConfigurationService