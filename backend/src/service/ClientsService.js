var randomstring = require('randomstring')

class ClientsService {
  constructor (OAuthClients) {
    this.OAuthClients = OAuthClients
  }

  createClient (clientId, redirectUris, grants) {
    return new Promise((resolve, reject) => {
      // TODO: further validations

      var OAuthClient = this.OAuthClients
      var newClient = new OAuthClient({
        clientId: clientId,
        clientSecret: randomstring.generate(32),
        redirectUris: redirectUris,
        grants: grants
      })

      newClient.save((err, client) => {
        if (err) {
          console.error(err)
          // TODO: Refactor mongoose validation errors (or custom validation)
          reject(err.errors)
        } else {
          console.log(`Created new client`)
          resolve(client)
        }
      })
    })
  }

  updateClient (client, redirectUris, grants) {
    return new Promise((resolve, reject) => {
      // TODO: further validations
      client.redirectUris = redirectUris
      client.grants = grants

      client.save((err, client) => {
        if (err) {
          console.error(err)
          // TODO: Refactor mongoose validation errors (or custom validation)
          reject(err.errors)
        } else {
          console.log(`Created new client`)
          resolve(client)
        }
      })
    })
  }

  /**
    * Get client.
    *
    * @param    clientId      {string}  The client id of the client to retrieve.
    * @param    clientSecret  {string}  The client secret of the client to retrieve. Can be null.
    *
    * @returns  An Object representing the client and associated data, or a falsy value if no such client could be found.
    * {
    *     id                      {string}          A unique string identifying the client.
    *     grants                  {Array.<string>}  Grant types allowed for the client.
    *     [redirectUris]          {Array.<string>}  Redirect URIs allowed for the client. Required for the authorization_code grant.
    *     [accessTokenLifetime]  {number}          Client-specific lifetime of generated access tokens in seconds.
    *     [refreshTokenLifetime]  {number}          Client-specific lifetime of generated refresh tokens in seconds.
    * }
    *
    */
  getClient (clientId, clientSecret) {
    return this.OAuthClients.findOne({
      clientId: clientId,
      clientSecret: clientSecret
    })
      .lean()
      .then(client => {
        if (!client) {
          return null
        }
        delete client.clientSecret
        return client
      })
  }
}

module.exports = ClientsService
