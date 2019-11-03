class BackendRoutingService {

    constructor(BackendConfigurationService) {
        this.BackendConfigurationService = BackendConfigurationService
    }


    getConfigForBackendUrl(url, basePath) {
        var regex = new RegExp(basePath + '/([a-zA-Z0-9.-]*)/*(.*)', 'i')
        var matches = regex.exec(url)

        var backendName = matches[1]
        var path = '/' + (matches[2] || '')

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

module.exports = BackendRoutingService
