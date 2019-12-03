const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')

// TODO: Configurize
const JWT_VALID_PERIOD = process.env.JWT_VALID_PERIOD || 60
const SECRET = process.env.JWT_SECRET || randomstring.generate()

class AuthService {

    constructor(UserDatabase) {
        this.UserDatabase = UserDatabase
    }

    getJwtSecret() {
        return SECRET
    }

    registerNewUser(registration) {
        return this.UserDatabase.create(registration)
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