const jwt = require('express-jwt')


// TODO: Configurize
const JWT_SECRET = 'secret'


Provider('AuthMiddleware', (AuthConfiguration) => {
    
    const getTokenFromHeaders = (req) => {
        const HEADER_PREFIX = 'Bearer'

        const authorization = req.headers.authorization

        if (authorization && authorization.split(' ')[0] === HEADER_PREFIX) {
            return authorization.split(' ')[1]
        }
        return null
    }

    const auth = {
        required: jwt({
            secret: JWT_SECRET,
            userProperty: 'payload',
            getToken: getTokenFromHeaders,
        }),
        optional: jwt({
            secret: JWT_SECRET,
            userProperty: 'payload',
            getToken: getTokenFromHeaders,
            credentialsRequired: false,
        }),
    }

    return auth
})