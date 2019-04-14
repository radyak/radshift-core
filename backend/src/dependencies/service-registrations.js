
Dependency('ConfigService', require('../util/ConfigService'))

Provider('PasswordHashService', () => {
  const PasswordHashService = require('../service/PasswordHashService')
  return PasswordHashService
})

Provider('TokenService', (OAuthTokens) => {
  const TokenService = require('../service/TokenService')
  return new TokenService(OAuthTokens)
})

Provider('AuthorizationCodeService', (OAuthAuthorizationCodes) => {
  const AuthorizationCodeService = require('../service/AuthorizationCodeService')
  return new AuthorizationCodeService(OAuthAuthorizationCodes)
})

Provider('UserService', (OAuthUsers, PasswordHashService) => {
  const UserService = require('../service/UserService')
  return new UserService(OAuthUsers, PasswordHashService)
})

Provider('ClientsService', (OAuthClients) => {
  const ClientsService = require('../service/ClientsService')
  return new ClientsService(OAuthClients)
})

Provider('AuthService', (ClientsService, TokenService, UserService, AuthorizationCodeService) => {
  const AuthService = require('../service/AuthService')
  return new AuthService(TokenService, ClientsService, UserService, AuthorizationCodeService)
})

Provider('BackendConfigurationService', () => {
  const DummyBackendConfigurationService = require('../service/DummyBackendConfigurationService')
  return new DummyBackendConfigurationService()
})

Provider('DockerApiClient', () => {
  const DockerApiClient = require('../client/DockerApiClient')
  return new DockerApiClient()
})

Provider('BackendsService', (BackendConfigurationService, DockerApiClient) => {
  const BackendsService = require('../service/BackendsService')
  return new BackendsService(BackendConfigurationService, DockerApiClient)
})
