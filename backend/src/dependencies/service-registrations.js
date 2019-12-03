Provider('BackendConfigurationService', () => {
  const FileBackendConfigurationService = require('../service/FileBackendConfigurationService')
  return new FileBackendConfigurationService()
})

Provider('AuthService', (UserDatabase) => {
  const AuthService = require('../service/AuthService')
  return new AuthService(UserDatabase)
})

Provider('BackendService', (BackendConfigurationService) => {
  const BackendService = require('../service/BackendService')
  return new BackendService(BackendConfigurationService)
})
