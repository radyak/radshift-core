var config = {
    "portainer": {
        "host": "portainer",
        "port": 9000,
        "label": "Portainer",
        "description": "Client w/ UI to inspect and manage Docker containers",
        "image": "portainer/portainer",
        "entry": ""
    },
    "testapp": {
        "label": "Test-App",
        "description": "Some sample app",
        "host": "test-app",
        "port": 3210,
        "image": "radyak/test-app",
        "entry": ""
    },
    "mongoclient": {
        "label": "Mongo DB Client",
        "description": "Client w/ UI to work with Mongo DB",
        "host": "mongoclient",
        "port": 3000,
        "image": "mongoclient/mongoclient",
        "entry": ""
    },
    // "mongodb": {
    //     "label": "Persistence",
    //     "description": "This Home Sweet Host's database",
    //     "host": "mongodb",
    //     "port": 3000
    // },
    // "gateway": {
    //     "label": "Gateway",
    //     "description": "This App",
    //     "host": "gateway",
    //     "port": 3000
    // }
}

class DummyBackendConfigurationService {

    getBackendConfiguration(name) {
        return config[name];
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