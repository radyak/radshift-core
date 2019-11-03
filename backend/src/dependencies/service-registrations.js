
Component('ConfigService', require('../util/ConfigService'))

Component('AdministrationService', (ConfigService) => {
  const AdministrationService = require('../service/AdministrationService')
  return new AdministrationService(ConfigService)
})

Provider('BackendConfigurationService', (backendsConfig) => {
  const DummyBackendConfigurationService = require('../service/DummyBackendConfigurationService')
  return new DummyBackendConfigurationService(backendsConfig)
})

Provider('DockerApiClient', () => {
  const DockerApiClient = require('../client/DockerApiClient')
  return new DockerApiClient()
})

Provider('RadHubClient', () => {
  const RadHubClient = require('../client/RadHubClient')
  return new RadHubClient()
})

Provider('BackendsService', (BackendConfigurationService, DockerApiClient, RadHubClient) => {
  const BackendsService = require('../service/BackendsService')
  return new BackendsService(BackendConfigurationService, DockerApiClient, RadHubClient)
})

Provider('AuthService', (User) => {
  const AuthService = require('../service/AuthService')
  return new AuthService(User)
})

Provider('BackendRoutingService', (BackendConfigurationService) => {
  const BackendRoutingService = require('../service/BackendRoutingService')
  return new BackendRoutingService(BackendConfigurationService)
})
