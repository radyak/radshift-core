const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')


const dataFile = process.env.PERSISTENCE_FILE || '/var/shared/data.json'
const dataDir = path.dirname(dataFile)
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
}

const adapter = new FileSync(dataFile)
const db = low(adapter)

db.defaults({
    users: []
})
.write()


// TODO: Configurize
const HASH_ITERATIONS = 10000,
      HASH_KEYLENGTH = 512,
      HASH_ALGORYTHM = 'sha512',

      USERNAME_PATTERN = /^[a-zA-Z0-9.\-_@]{5,32}$/g,
      PASSWORD_PATTERN = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g,
      PERMISSION_PATTERN = /^[a-zA-Z0-9.\-_]{3,32}$/g


const checkPermissions = (permissions) => {
    if (!permissions || !permissions.length > 0) {
        return
    }
    for (let permission of permissions) {
        if (!PERMISSION_PATTERN.test(permission)) {
            throw 'A permission name is invalid. Must only contain letters, numbers and following symbols: . - _'
        }
    }
}


const checkUsername = (username) => {
    if (!username || !USERNAME_PATTERN.test(username)) {
        throw 'Username is invalid. Must only contain letters, numbers and following symbols: . - _ @'
    }
}

    
const checkPassword = (password) => {
    if (!password || !PASSWORD_PATTERN.test(password)) {
        throw 'Password is invalid. Must have at least 8 letters, 1 lower case and 1 upper case character, 1 number and 1 special character (!@#$%^&)'
    }
}


const setPasswordForUser = (user, password) => {
    checkPassword(password)
    user.salt = crypto.randomBytes(16).toString('hex')
    user.hash = crypto.pbkdf2Sync(password, user.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
}


const isPasswordValidForUser = (user, password) => {
    if (!user || !password) {
        return false;
    }
    const hash = crypto.pbkdf2Sync(password, user.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
    return user.hash === hash
}


const toJSON = (user) => {
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


Component('UserDatabase', class UserDatabase {

    findByUsername(username) {
        return new Promise((resolve, reject) => {
            let user = db
                    .get('users')
                    .find({ username: username })
                    .value()
            resolve(toJSON(user))
        })
    }


    findAll() {
        return new Promise((resolve, reject) => {
            let users = db
                    .get('users')
                    .map(toJSON)
                    .value()
            resolve(users)
        })
    }


    deleteByUsername(username) {
        return new Promise((resolve, reject) => {
            let deletedUsers = db
                    .get('users')
                    .remove({username: username})
                    .write()
            resolve(deletedUsers.length)
        })
    }


    deleteAll() {
        return new Promise((resolve, reject) => {
            db.get('users')
                .remove({})
                .write()
            resolve()
        })
    }
    

    create(username, password, permissions = []) {
        return this.findByUsername(username).then(existingUser => {
            if (existingUser) {
                throw `User with username ${username} already exists`
            }
            checkUsername(username)
            checkPassword(password)
            checkPermissions(permissions)

            let user = {
                username: username,
                permissions: permissions || [],
                // email: null,
                // firstname: null,
                // lastname: null,
            }
            setPasswordForUser(user, password)

            db.get('users')
                    .push(user)
                    .write()
            
            return toJSON(user)
        })
    }


    update(user) {
        checkUsername(user.username)
        checkPermissions(user.permissions)

        user = db.get('users')
            .find({ username: user.username })
            .assign({
                username: user.username,
                permissions: user.permissions,
            })
            .write()
        return toJSON(user)
    }
    

    changePassword(username, password) {
        return this.findByUsername(username)
            .then(existingUser => {
                if (!existingUser) {
                    return null
                }
        
                setPasswordForUser(existingUser, password)
                this.update(existingUser)
                return this.findByUsername(username)
            })
    }


    validatePassword(username, password) {
        return new Promise((resolve, reject) => {
            let user = db
                    .get('users')
                    .find({ username: username })
                    .value()
            
            if (isPasswordValidForUser(user, password)) {
                resolve(toJSON(user))
            }
            else {
                reject()
            }
        })
    }


})
  