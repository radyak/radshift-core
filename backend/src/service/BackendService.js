class BackendService {

    constructor(BackendConfigurationService) {
        this.BackendConfigurationService = BackendConfigurationService
    }


    getConfigByHostname(hostname, path) {
        var backendName = hostname.split('.')[0]

        var backendConfig = this.BackendConfigurationService.getBackendConfiguration(backendName)

        let security = backendConfig.security || {}
        
        var rule = this.getSecurityRule(security.rules, path)

        security = {
            ...security,
            ...rule
        }

        var result = {
            ...backendConfig,
            ...security
        }

        delete result.security
        delete result.rules

        Logger.debug('Security rule:', result)
        
        return result
    }

    getSecurityRule(securityRules, path) {

        if (!securityRules || !securityRules.length) {
            return {}
        }
        
        for(let rule of securityRules) {
            let regExp = new RegExp(rule.resourceMatcher, 'i')
            if (regExp.test(path)) {
                return rule
            }
        }
        return {}
    }


}

module.exports = BackendService
