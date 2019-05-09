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

    /*
        There are three possibilities to provide AuthN & AuthZ for backends:
            1. Forward the JWT. Backends can trust it and simply decode it since it has already been verified by authenticationOptional
            2. Forward the user details from the decoded JWT. Might be more unclean but simpler for testing
            3. Let backends specify AuthN & AuthZ requirements in their backendConfig for the core to check them, e.g.
                ...
                "myapp": {
                    "securityRules": [
                        {
                            path: "/some/path/**",
                            authenticated: true,
                            permissions: [
                                "some",
                                "permissions"
                            ]
                        }
                    ]
                }
    */
    const backendForwarding = (req, res, next) => {
        if (!req[TOKEN_PROPERTY]) {
            return
        }
        req.headers['X-User'] = req.user.name
        req.headers['X-Scope'] = req.user.scope
    }

    const errorHandler = function(err, req, res, next) {
        console.log(`err.name = ${err.name}`)
        if (err.name === 'UnauthorizedError') {
            return res.status(401).send()
        }
        next(req, res, next)
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
            errorHandler
        ],
        hasPermission: authorization,
        backendForwarding: [
            authenticationOptional,
            backendForwarding,
            errorHandler
        ]
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
        hasPermission: (permission) => mockMiddleware,
        backendForwarding: mockMiddleware
    }

}, 'no-auth')