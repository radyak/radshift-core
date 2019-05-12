var Schema = require('validate')


const ConfigSchema = new Schema({
    hostDomain: {
        type: String,
        length: {
            min: 6,
            max: 512
        },
        match: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
        message: {
            length: 'Host Domain can have between 6 and 512 characters',
            match: 'Host Domain is not a valid domain'
        }
    },
    adminEmail: {
        type: String,
        length: {
            min: 6,
            max: 512
        },
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: {
            length: 'Admin Email can have between 6 and 512 characters',
            match: 'Admin Email is not a valid email'
        }
    },
    dynDnsProviderUsername: {
        type: String
    },
    dynDnsProviderPassword: {
        type: String
    },
    dynDnsProviderHost: {
        type: String
    },
    dynDnsUpdateIntervalMinutes: {
        type: Number,
        use: {
            positive: value => (value >= 0)
        },
        message: {
            positive: 'DynDNS Update Interval Minutes cannot be negative'
        }
    }
})


class AdministrationService {

    constructor(configService) {
        this.configService = configService
    }

    getConfig() {
        return this.configService.getConfigSecure()
    }

    saveConfig(config) {
        return new Promise((resolve, reject) => {
            const errors = ConfigSchema.validate(config)
                        
            if (errors && errors.length) {
                return reject({
                    message: 'ValidationError',
                    errors: this.mapErrors(errors)
                })
            }
            this.removeEmptyStringValues(config)
            
            this.configService.addConfig(config).then(() => {
                resolve(resolve(this.configService.getConfigSecure()))
            })
        })
    }

    mapErrors(errors) {
        return errors.map(error => {
            return {
                property: error.path,
                message: error.message
            }
        })
    }

    removeEmptyStringValues(obj) {
        for (let key of Object.keys(obj)) {
            if (!obj[key] || obj[key] && obj[key].trim && !obj[key].trim()) {
                delete obj[key]
            }
        }
    }

}

module.exports = AdministrationService