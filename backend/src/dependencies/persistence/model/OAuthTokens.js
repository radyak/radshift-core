var mongoose = require('mongoose')
var Schema = mongoose.Schema

Provider('OAuthTokens', (MongoDBConnection) => {
  return mongoose.model('OAuthTokens', new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client: { type: Object }, // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresOn: { type: Date },
    user: { type: Object },
    userId: { type: String }
  }))
})
