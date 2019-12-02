const crypto = require('crypto')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(process.env.PERSISTENCE_FILE || '/var/shared/data.json')
const db = low(adapter)

db.defaults({
    users: []
})
.write()


// TODO: Configurize
const HASH_ITERATIONS = 10000,
      HASH_KEYLENGTH = 512,
      HASH_ALGORYTHM = 'sha512'

    /* User Schema:
        {
            username: String,
            email: String,
            firstname: String,
            lastname: String,
            permissions: [ String ],
            hash: String,
            salt: String,
        }
    */


Component('UserService', class {

    findByName(name) {
        return new Promise((resolve, reject) => {
            let user = db
                    .get('users')
                    .find({ username: name })
                    .value()
            resolve(this.toJSON(user))
        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            let users = db
                    .get('users')
                    .map(this.toJSON)
                    .value()
            resolve(users)
        })
    }

    deleteByUsername(name) {
        return new Promise((resolve, reject) => {
            let deletedUsers = db
                    .get('users')
                    .remove({username: name})
                    .write()
            resolve(deletedUsers.length)
        })
    }

    deleteAll() {
        db.get('users')
            .remove({})
            .write()
    }
    
    /*
    {
        password
        passwordRepeat
        username
    }
     */
    createUser(registration) {
        let username = registration && registration.username
        let password = registration && registration.password
        let passwordRepeat = registration && registration.passwordRepeat

        this.checkNewPassword(password, passwordRepeat)

        return this.findByName(username).then(existingUser => {
            if (existingUser) {
                throw `User with username ${username} already exists`
            }

            let user = {
                username: username,
                permissions: [],
                // email: null,
                // firstname: null,
                // lastname: null,
            }
            this.setPassword(user, password)
            db.get('users')
                    .push(user)
                    .write()
            
            return this.toJSON(user)
        })
    }
    

    changePassword(username, password, passwordRepeat) {
        return this.findByName(username)
            .then(existingUser => {
                if (!existingUser) {
                    return null
                }
        
                this.checkNewPassword(password, passwordRepeat)

                this.setPassword(existingUser, password)
                this.updateUser(existingUser)
                return this.findByName(username)
            })
    }


    changePermissions(username, permissions) {
        return this.findByName(username)
            .then(existingUser => {
                if (!existingUser) {
                    return null
                }
                existingUser.permissions = permissions
                return this.updateUser(existingUser)
            })
    }


    updateUser(user) {
        user = db.get('users')
            .find({ username: user.username })
            .assign(user)
            .write()
        return this.toJSON(user)
    }


    toJSON(user) {
        if (!user) {
            return user
        }
        let result = {
            ...user
        }
        delete result.hash
        delete result.salt
        return result;
    }


    checkNewPassword(password, passwordRepeat) {
        if (!password || !password.trim()) {
            throw 'No password is set'
        }
        if (password !== passwordRepeat) {
            throw 'Password and password repition must be identical'
        }
    }


    setPassword(user, password) {
        user.salt = crypto.randomBytes(16).toString('hex')
        user.hash = crypto.pbkdf2Sync(password, user.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
    }


    validatePassword(user, password) {
        const hash = crypto.pbkdf2Sync(password, user.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
        return user.hash === hash
    }


})
  