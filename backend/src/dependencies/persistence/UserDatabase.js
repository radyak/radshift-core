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


const HASH_ITERATIONS = 10000,
      HASH_KEYLENGTH = 512,
      HASH_ALGORYTHM = 'sha512',

      USERNAME_PATTERN = /^[a-zA-Z0-9.\-_@]{3,32}$/,
      PASSWORD_PATTERN = /^[a-zA-Z0-9.\-_@\w!#$%^&*]{6,128}$/,
      PERMISSION_PATTERN = /^[a-zA-Z0-9.\-_]{3,32}$/


const setPasswordForUser = (user, password) => {
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
            permissions: [ String ],
            hash: String,
            salt: String,
        }
    */


module.exports = class UserDatabase {


    checkUsername(username) {
        if ((!username) || (!USERNAME_PATTERN.test(username))) {
            throw `Username ${username} is invalid. Must contain 3 - 32 letters, numbers and following symbols: . - _ @`
        }
    }


    checkPassword(password) {
        if (!password || !PASSWORD_PATTERN.test(password)) {
            throw 'Password is invalid. Must contain 8 - 128 characters: 1 lower case and 1 upper case character, 1 number and 1 special character ! @ # $ % ^ & * . - _'
        }
    }


    checkPermissions(permissions = []) {
        for (let permission of permissions) {
            if (!PERMISSION_PATTERN.test(permission)) {
                throw `Permission ${permission} is invalid. Must contain 3 - 32 letters, numbers and following symbols: . - _`
            }
        }
    }


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
            this.checkUsername(username)
            this.checkPassword(password)
            this.checkPermissions(permissions)
     
            let user = {
                username: username,
                permissions: permissions || [],
                // email: null,
                // firstname: null,
                // lastname: null,
            }
            this.checkPassword(password)
            setPasswordForUser(user, password)

            db.get('users')
                    .push(user)
                    .write()
            
            return toJSON(user)
        })
    }


    update(user) {
        this.checkUsername(user.username)
        this.checkPermissions(user.permissions)

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
        
                this.checkPassword(password)
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


}