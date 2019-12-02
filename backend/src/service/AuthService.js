const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')

// TODO: Configurize
const JWT_VALID_PERIOD = process.env.JWT_VALID_PERIOD || 60
const SECRET = process.env.JWT_SECRET || randomstring.generate()

class AuthService {

    constructor(UserService) {
        this.UserService = UserService
    }

    getJwtSecret() {
        return SECRET
    }

    registerNewUser(registration) {
        return this.UserService.createUser(registration)
    }

    changeUserPassword(username, password, passwordRepeat) {
        return this.UserService.changePassword(username, password, passwordRepeat)
    }

    changeUserPermissions(username, permissions) {
        return this.UserService.changePermissions(username, permissions)
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