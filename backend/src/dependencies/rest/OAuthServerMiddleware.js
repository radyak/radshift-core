const OAuthServer = require('express-oauth-server')

Provider('OAuthServerMiddleware', (AuthService) => {
  // See https://github.com/oauthjs/node-oauth2-server for specification
  return new OAuthServer({
    debug: true,
    model: AuthService
  })
})
