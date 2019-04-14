class AuthService {
  constructor (TokenService, ClientsService, UserService, AuthorizationCodeService) {
    this.TokenService = TokenService
    this.ClientsService = ClientsService
    this.UserService = UserService
    this.AuthorizationCodeService = AuthorizationCodeService
  }

  getAccessToken (bearerToken) {
    return this.TokenService.getAccessToken(bearerToken)
  }

  getRefreshToken (refreshToken) {
    return this.TokenService.getRefreshToken(refreshToken)
  }

  saveToken (token, client, user) {
    return this.TokenService.saveToken(token, client, user)
  }

  // optional
  generateAccessToken (client, user, scope) {
    return this.TokenService.generateJWT(client, user, scope)
  }

  // optional
  // generateRefreshToken(client, user, scope){ },

  // optional
  // generateAuthorizationCode(client, user, scope){ },

  getUser (username, password) {
    return this.UserService.getUserByLogin(username, password)
  }

  getClient (clientId, clientSecret) {
    return this.ClientsService.getClient(clientId, clientSecret)
  }

  getAuthorizationCode (authorizationCode) {
    return this.AuthorizationCodeService.getAuthorizationCode(authorizationCode)
  }

  saveAuthorizationCode (code, client, user) {
    return this.AuthorizationCodeService.saveAuthorizationCode(code, client, user)
  }

  revokeAuthorizationCode (code) {
    return this.AuthorizationCodeService.revokeAuthorizationCode(code)
  }
}

module.exports = AuthService
