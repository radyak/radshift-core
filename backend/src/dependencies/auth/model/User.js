const crypto = require('crypto')
const uniqueValidator = require('mongoose-unique-validator')

// TODO: Configurize
const HASH_ITERATIONS = 10000,
      HASH_KEYLENGTH = 512,
      HASH_ALGORYTHM = 'sha512'

Provider('User', (MongoDBConnection) => {

    var Schema = MongoDBConnection.Schema

    const UserSchema = new Schema({
        username: {
            required: true,
            type: String,
            index: true,
            unique: true
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
    
    UserSchema.methods.toJSON = function() {
        var obj = this.toObject()
        delete obj.hash
        delete obj.salt
        return obj;
    }

    UserSchema.methods.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex')
        this.hash = crypto.pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
    }

    UserSchema.methods.validatePassword = function(password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
        return this.hash === hash
    }

    UserSchema.plugin(uniqueValidator)

    try {
        return MongoDBConnection.model('User')
    } catch (e) {
        return MongoDBConnection.model('User', UserSchema)
    }
})
  