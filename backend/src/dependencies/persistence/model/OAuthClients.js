var mongoose = require('mongoose')
var Schema = mongoose.Schema

Provider('OAuthClients', (MongoDBConnection) => {
  return mongoose.model('OAuthClients', new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array },
    grants: { type: Array }
  }))
})
