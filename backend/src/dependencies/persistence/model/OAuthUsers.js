var mongoose = require('mongoose')
var Schema = mongoose.Schema

Provider('OAuthUsers', (MongoDBConnection) => {
  return mongoose.model('OAuthUsers', new Schema({
    email: {
      type: String,
      min: [10, 'Email is too short'],
      max: [99, 'Email is too long'],
      required: [true, 'Email is required'],
      match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
      type: String,
      min: [10, 'Password is too short'],
      max: [99, 'Password is too long'],
      required: [true, 'Password is required']
    },
    username: {
      type: String,
      min: [10, 'Username is too short'],
      max: [24, 'Username is too long'],
      required: [true, 'Username is required']
    }
  }))
})
