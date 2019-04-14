class AuthorizationCodeService {
  constructor (OAuthAuthorizationCodes) {
    this.OAuthAuthorizationCodes = OAuthAuthorizationCodes
  }

  /**
   * Get Authorization code
   *
   * Invoked to retrieve an existing authorization code previously saved through Model#saveAuthorizationCode().
   * This model function is required if the authorization_code grant is used.
   *
   * @param   {string}  authorizationCode  The authorization code to retrieve.
   *
   * @returns An Object representing the authorization code and associated data.
   * {
   *    code            {string}  The authorization code passed to getAuthorizationCode().
   *    expiresAt      {date}    The expiry time of the authorization code.
   *    client          {object}  The client associated with the authorization code.
   *    client.id      {string}  A unique string identifying the client.
   *    user            {object}  The user associated with the authorization code.
   *    [redirectUri]  {string}  The redirect URI of the authorization code.
   *    [scope]        {string}  The authorized scope of the authorization code.
   * }
   */
  getAuthorizationCode (authorizationCode) {
    return this.OAuthAuthorizationCodes.findOne({ authorizationCode: authorizationCode }).lean()
  }

  /**
   *
   * Save Authorization code
   *
   * Invoked to save an authorization code.
   * This model function is required if the authorization_code grant is used.
   *
   * @param {Code} code       The code to be saved
   *        authorizationCode  String  The authorization code to be saved.
   *        expiresAt  Date  The expiry time of the authorization code.
   *        redirectUri  String  The redirect URI associated with the authorization code.
   *        [scope]  String  The authorized scope of the authorization code.
   * @param {Client} client   The client associated with the authorization code.
   * @param {User} user       The user associated with the authorization code.
   *
   * @returns {Code}
   * {
   *    authorizationCode  String  The authorization code passed to saveAuthorizationCode().
   *    expiresAt  Date  The expiry time of the authorization code.
   *    redirectUri  String  The redirect URI associated with the authorization code.
   *    [scope]  String  The authorized scope of the authorization code.
   *    client  Object  The client associated with the authorization code.
   *    client.id  String  A unique string identifying the client.
   *    user  Object  The user associated with the authorization code.
   * }
   */
  saveAuthorizationCode (code, client, user) {
    var OAuthAuthorizationCode = this.OAuthAuthorizationCodes
    var authorizationCode = new OAuthAuthorizationCode({
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      clientId: client.id,
      userId: user.id
    })

    // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
    return new Promise(function (resolve, reject) {
      authorizationCode.save(function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
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

  // TODO: Implement
  revokeAuthorizationCode (code) {
  }
}

module.exports = AuthorizationCodeService
