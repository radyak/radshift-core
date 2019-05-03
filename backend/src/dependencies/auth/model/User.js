const crypto = require('crypto')

// TODO: Configurize
const HASH_ITERATIONS = 10000,
      HASH_KEYLENGTH = 512,
      HASH_ALGORYTHM = 'sha512'

Provider('User', (MongoDBConnection) => {

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

    UsersSchema.methods.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex')
        this.hash = crypto.pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
    }

    UsersSchema.methods.validatePassword = function(password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
        return this.hash === hash
    }

    return MongoDBConnection.model('Users', UsersSchema)
})
  