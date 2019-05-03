var config = {}

class DummyBackendConfigurationService {

    constructor(backendsConfig) {
        config = backendsConfig
    }

    getBackendConfigurations() {
        return config
    }

    getBackendConfiguration(name) {
        return config[name]
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

module.exports = DummyBackendConfigurationService