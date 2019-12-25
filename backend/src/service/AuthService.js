const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const fs = require('fs')

const Logger = require('../logging/Logger')

const JWT_VALID_PERIOD = process.env.JWT_VALID_PERIOD || 60,
      SECRET = process.env.JWT_SECRET || randomstring.generate(),
      MAX_AUTH_ATTEMPTS = process.env.MAX_AUTH_ATTEMPTS || 5,
      MAX_AUTH_ATTEMPTS_BLOCKED_FOR_SECONDS = process.env.MAX_AUTH_ATTEMPTS_BLOCKED_FOR_SECONDS || 300000    // default: 300 sec = 5 min


const FAILED_AUTH_ATTEMPTS_BY_IP = {}

class AuthService {

    constructor(UserDatabase) {
        this.UserDatabase = UserDatabase
    }

    getJwtSecret() {
        return SECRET
    }

    getBlockedUntil(clientKey) {
        let blockingData = FAILED_AUTH_ATTEMPTS_BY_IP[clientKey]
        return blockingData ? blockingData.blockedUntil : null
    }

    isBlocked(clientKey) {
        let blockingData = FAILED_AUTH_ATTEMPTS_BY_IP[clientKey]
        return blockingData && (blockingData.blockedUntil > new Date().getTime())
    }

    unblock(clientKey) {
        delete FAILED_AUTH_ATTEMPTS_BY_IP[clientKey]
    }

    updateFailedAuthAttempt(clientKey) {
        let blockingData = FAILED_AUTH_ATTEMPTS_BY_IP[clientKey] || {
            failedAttempts: 0,
            blockedUntil: new Date().getTime()
        }

        blockingData.failedAttempts++
        
        // After the 3rd failed retry, add 5 Minutes
        blockingData.blockedUntil = blockingData.failedAttempts >= MAX_AUTH_ATTEMPTS
                ? new Date().getTime() + MAX_AUTH_ATTEMPTS_BLOCKED_FOR_SECONDS
                : 0
        
        FAILED_AUTH_ATTEMPTS_BY_IP[clientKey] = blockingData

    }

    registerNewUser(username, password, permissions = []) {
        return this.UserDatabase.create(username, password, permissions).then(user => {
            try {
                const fsRoot = process.env.FS_ROOT || ''
                fs.mkdirSync(`${fsRoot}/home/${username}`, { recursive: true })
            } catch(e) {
                Logger.error('Could not create user directory', e)
                throw 'Could not create user directory'
            }
            return user
        })
    }

    validatePassword(username, password) {
        return this.UserDatabase.validatePassword(username, password)
    }

    changeUserPassword(username, password) {
        return this.UserDatabase.changePassword(username, password)
    }

    changeUserPermissions(username, permissions) {
        return this.UserDatabase.findByUsername(username)
            .then(existingUser => {
                if (!existingUser) {
                    return null
                }
                existingUser.permissions = permissions
                return this.UserDatabase.update(existingUser)
            })
    }

    generateJWT(user) {
        const now = new Date()
        const expirationDate = new Date(now)
        expirationDate.setDate(now.getDate() + JWT_VALID_PERIOD)

        return jwt.sign({
            name: user.username,
            scope: user.permissions.join(' '),
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, this.getJwtSecret())
    }
}

module.exports = AuthService