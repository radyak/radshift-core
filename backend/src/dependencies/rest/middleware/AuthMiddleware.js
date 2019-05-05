const jwt = require('express-jwt')


// TODO: Configurize
const JWT_SECRET = 'secret'


Provider('AuthMiddleware', (AuthConfiguration) => {

    const TOKEN_PROPERTY = 'user'
    
    const getTokenFromHeaders = (req) => {
        const HEADER_PREFIX = 'Bearer'

        const authorization = req.headers.authorization

        if (authorization && authorization.split(' ')[0] === HEADER_PREFIX) {
            return authorization.split(' ')[1]
        }
        return null
    }


    const authentication = jwt({
        secret: JWT_SECRET,
        userProperty: TOKEN_PROPERTY,
        getToken: getTokenFromHeaders
    })

    const authenticationOptional = jwt({
        secret: JWT_SECRET,
        userProperty: TOKEN_PROPERTY,
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    })

    const authorization = (permission) => {
        return [
            authentication,
            (req, res, next) => {
                try {
                    let token = req[TOKEN_PROPERTY]
                    let currentPermissions = token.scope && token.scope.split(' ')
                    if (currentPermissions && currentPermissions.indexOf(permission) != -1) {
                        return next()
                    }
                    throw 'Forbidden'
                } catch (err) {
                    res.status(403).send({
                        error: err
                    })
                }
            }
        ]
    }
    

    const auth = {
        authenticated: authentication,
        authenticatedOptional: authenticationOptional,
        hasPermission: authorization
    }

    return auth
})


Provider('AuthMiddleware', (AuthConfiguration) => {

    const mockMiddleware = (req, res, next) => {
        return next()
    }

    return {
        authenticated: mockMiddleware,
        authenticatedOptional: mockMiddleware,
        hasPermission: (permission) => mockMiddleware
    }

}, 'no-auth')