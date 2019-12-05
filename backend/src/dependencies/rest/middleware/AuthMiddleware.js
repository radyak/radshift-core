const jwt = require('express-jwt')


Provider('AuthMiddleware', (AuthConfiguration, BackendService, AuthService) => {

    const TOKEN_PROPERTY = 'user'
    const AUTH_HEADER_NAME = 'authorization'
    const AUTH_HEADER_PREFIX = 'Bearer'
    const AUTH_COOKIE_NAME = 'Authorization'
    
    const getTokenFromHeaders = (req) => {

        const authorization = req.headers[AUTH_HEADER_NAME]

        if (authorization && authorization.split(' ')[0] === AUTH_HEADER_PREFIX) {
            return authorization.split(' ')[1]
        }
        return null
    }

    const getTokenFromCookies = (req) => {
        const authorization = req.cookies[AUTH_COOKIE_NAME]
        return authorization
    }

    const getTokenFromRequest = (req) => {
        return getTokenFromCookies(req) || getTokenFromHeaders(req)
    }

    const authentication = jwt({
        secret: AuthService.getJwtSecret(),
        userProperty: TOKEN_PROPERTY,
        getToken: getTokenFromRequest
    })

    const errorHandler = function(err, req, res, next) {
        console.error(`An error occurred: `, err)
        if (err.name === 'UnauthorizedError') {
            return res.status(401).send()
        }
        next()
    }

    const authenticationOptional = jwt({
        secret: AuthService.getJwtSecret(),
        userProperty: TOKEN_PROPERTY,
        getToken: getTokenFromRequest,
        credentialsRequired: false,
    })

    const errorHandlerOptional = function(err, req, res, next) {
        console.warn(`An error occurred: `, err)
        next()
    }

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
            },
            errorHandler
        ]
    }
    

    const auth = {
        authenticated: [
            authentication,
            errorHandler
        ],
        authenticatedOptional: [
            authenticationOptional,
            errorHandlerOptional
        ],
        hasPermission: authorization
    }

    return auth
})


Provider('AuthMiddleware', (AuthConfiguration, BackendService) => {

    const mockMiddleware = (req, res, next) => {
        return next()
    }

    return {
        authenticated: mockMiddleware,
        authenticatedOptional: mockMiddleware,
        hasPermission: (permission) => mockMiddleware
    }

}, 'no-auth')