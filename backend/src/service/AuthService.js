const jwt = require('jsonwebtoken')

// TODO: Configurize
const JWT_SECRET = 'secret'
const JWT_VALID_PERIOD = 60

class AuthService {

    generateJWT(user) {
        const now = new Date()
        const expirationDate = new Date(now)
        expirationDate.setDate(now.getDate() + JWT_VALID_PERIOD)

        return jwt.sign({
            name: user.username,
            scope: user.permissions.join(' '),
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, JWT_SECRET)
    }
}

module.exports = AuthService