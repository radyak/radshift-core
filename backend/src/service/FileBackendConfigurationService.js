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

    registerBackend(name, config) {
        // TODO: Add more detailed validations
        if (!name) {
            throw new Error(`Cannot register backend - name '${name}' is invalid`)
        }
        if (!config) {
            throw new Error(`Cannot register backend '${name}' - config is invalid`)
        }
        if (config[name]) {
            throw new Error(`Cannot register backend '${name}' - already registered`)
        }
        config[name] = config
    }

    unregisterBackend(name) {
        // TODO: Add more detailed validations
        if (!name) {
            throw new Error(`Cannot unregister backend - name '${name}' is invalid`)
        }
        if (!config[name]) {
            throw new Error(`Cannot unregister backend '${name}' - was not registered yet`)
        }
        delete config[name]
    }

}

module.exports = FileBackendConfigurationService