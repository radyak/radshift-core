const mongoose = require('mongoose')
const crypto = require('crypto')

// TODO: Configurize
const HASH_ITERATIONS = 10000,
      HASH_KEYLENGTH = 512,
      HASH_ALGORYTHM = 'sha512'

Provider('Users', (MongoDBConnection) => {

    var Schema = MongoDBConnection.Schema

    const UsersSchema = new Schema({
        username: {
            required: true,
            type: String
        },
        email: {
            // required: true,
            type: String
        },
        firstname: String,
        lastname: String,
        permissions: [ String ],
        hash: String,
        salt: String,
    })
    
    UsersSchema.methods.toJSON = function() {
        var obj = this.toObject()
        delete obj.hash
        delete obj.salt
        return obj;
    }

    UsersSchema.methods.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex')
        this.hash = crypto.pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
    }

    UsersSchema.methods.validatePassword = function(password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
        return this.hash === hash
    }

    UsersSchema.path('username').validate(async (value) => {
        const count = await mongoose.models.Users.countDocuments({ username: value })
        return !count
    }, 'Username already exists')

    return MongoDBConnection.model('Users', UsersSchema)
})
  