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
      HASH_ALGORYTHM = 'sha512'


const setPasswordForUser = (user, password) => {
    user.salt = crypto.randomBytes(16).toString('hex')
    user.hash = crypto.pbkdf2Sync(password, user.salt, HASH_ITERATIONS, HASH_KEYLENGTH, HASH_ALGORYTHM).toString('hex')
}

const checkPasswordForUser = (user, password) => {
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
        user = db.get('users')
            .find({ username: user.username })
            .assign(user)
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
            
            let isValid = checkPasswordForUser(user, password)

            if (isValid) {
                resolve(toJSON(user))
            }
            else {
                reject()
            }
        })
    }


})
  