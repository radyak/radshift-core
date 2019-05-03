const jwt = require('express-jwt');


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
    };

    const getTokenFromCookie = (req) => {
        
        const COOKIE_PREFIX = 'Authorization='

        if (!req.headers.cookie) {
            return null
        }
        var rawCookie = req.headers.cookie
                .split(/\s*;\s*/g)
                .filter((cookie => cookie.indexOf(COOKIE_PREFIX) === 0))[0]

        if (!rawCookie) {
            return null
        }
        var cookie = rawCookie.replace(COOKIE_PREFIX, '')
        return cookie
    };

    const getToken = getTokenFromCookie

    const auth = {
        required: jwt({
            secret: JWT_SECRET,
            userProperty: 'payload',
            getToken: getToken,
        }),
        optional: jwt({
            secret: JWT_SECRET,
            userProperty: 'payload',
            getToken: getToken,
            credentialsRequired: false,
        }),
    };

    return auth
})