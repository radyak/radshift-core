var mongoose = require('mongoose')
var Schema = mongoose.Schema

Provider('OAuthAuthorizationCodes', (MongoDBConnection) => {
  return mongoose.model('OAuthAuthorizationCodes', new Schema({
    authorization_code: { type: String },
    expiresAt: { type: Date },
    redirectUri: { type: String },
    scope: { type: String },
    clientId: { type: String },
    userId: { type: String }
  }))
})
