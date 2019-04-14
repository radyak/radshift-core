var jwt = require('jsonwebtoken')

class TokenService {
  constructor (OAuthTokens) {
    this.OAuthTokens = OAuthTokens
  }

  /**
   * Get access token.
   * required if OAuth2Server#authenticate() is used.
   *
   * @param   accessToken  {string}  The access token to retrieve.
   *
   * @returns An Object representing the access token and associated data.
   * {
   *      accessToken           {string}  The access token passed to getAccessToken().
   *      accessTokenExpiresAt  {date}    The expiry time of the access token.
   *      client                {object}  The client associated with the access token.
   *      client.id             {string}  A unique string identifying the client.
   *      user                  {object}  The user associated with the access token.
   *      [scope]               {string}  The authorized scope of the access token.
   * }
   */
  getAccessToken (bearerToken) {
    return this.OAuthTokens.findOne({ accessToken: bearerToken }).lean()
  }

  /**
   * Get refresh token.
   * required if the refresh_token grant is used
   *
   * TODO: elaborate later
   */
  getRefreshToken (refreshToken) {
    return this.OAuthTokens.findOne({ refreshToken: refreshToken }).lean()
  }

  /**
   * Save token.
   * required for all grant types
   *
   * @param token  Object  The token(s) to be saved.
   *  {
   *      accessToken              {string}  The access token to be saved.
   *      accessTokenExpiresAt      {date}    The expiry time of the access token.
   *      [refreshToken]            {string}  The refresh token to be saved.
   *      [refreshTokenExpiresAt]  {date}    The expiry time of the refresh token.
   *      [scope]                  {string}  The authorized scope of the token(s).
   * }
   * @param client  {object}  The client associated with the token(s).
   * @param user    {object}  The user associated with the token(s).
   *
   * @returns
   * {
   *    token                  {object}  The return value.
   *    accessToken            {string}  The access token passed to saveToken().
   *    accessTokenExpiresAt    {date}    The expiry time of the access token.
   *    refreshToken            {string}  The refresh token passed to saveToken().
   *    refreshTokenExpiresAt  {date}    The expiry time of the refresh token.
   *    client                  {object}  The client associated with the access token.
   *    client.id              {string}  A unique string identifying the client.
   *    user                    {object}  The user associated with the access token
   *    [scope]                {string}  The authorized scope of the access token.
   * }
   */
  saveToken (token, client, user) {
    console.log(`calling saveToken`)
    var OAuthToken = this.OAuthTokens
    var accessToken = new OAuthToken({
      accessToken: token.accessToken,
      accessTokenExpiresOn: token.accessTokenExpiresOn,
      client: client,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresOn: token.refreshTokenExpiresOn,
      user: user,
      userId: user._id
    })

    // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
    return new Promise(function (resolve, reject) {
      accessToken.save(function (err, data) {
        if (err) reject(err)
        else resolve(data)
      })
    }).then(function (saveResult) {
      // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
      saveResult = saveResult && typeof saveResult === 'object' ? saveResult.toJSON() : saveResult

      // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
      var data = {}
      for (var prop in saveResult) data[prop] = saveResult[prop]

      // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
      data.client = data.clientId
      data.user = data.userId

      return data
    })
  }

  /**
   * Generate a JWT
   *
   * @param client  {object}  The client associated with the JWT.
   * @param user    {object}  The user associated with the JWT.
   * @param jwt    {object}  The scopes associated with the access token. Can be null.
   *
   * @returns   {string}  The JWT
   */
  generateJWT (client, user, scope) {
    var payload = {
      id: user._id
    }

    var options = {

      // Numeric:     seconds
      // String:
      //    w/ unit:  according to unit
      //    w/o unit: milliseconds
      expiresIn: 3600,

      issuer: 'homesweethost'
    }

    return jwt.sign(payload, 'secret', options)
  }
}

module.exports = TokenService
