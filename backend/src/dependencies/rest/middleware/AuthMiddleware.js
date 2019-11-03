const jwt = require('express-jwt')


// TODO: Configurize
const JWT_SECRET = 'secret'


Provider('AuthMiddleware', (AuthConfiguration, BackendRoutingService) => {

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
        Example security configuration section for backend:
            {
                ...,
                "myapp": {
                    ...,
                    "security": {
                        rules: [
                            {
                                "resourceMatcher": "*.\.js",
                                "authenticated": false
                            },
                            {
                                "resourceMatcher": "/admin",        -> mandatory
                                "authenticated": true,              -> optional; default: false
                                "permissions": [                    -> optional; default: []; if not empty, interpreted as authenticated = true
                                    "admin"
                                ],
                                "onUnAuthenticated": 401,           -> optional; if nothing specified, redirect to "/login"
                                "onUnAuthorized": 404,              -> optional; default 403
                                "mappings": {
                                    "name": "X-Username",           -> default: X-User
                                    "scope": "X-Roles"              -> default: X-Scope
                                }
                            },
                            ...
                        ],

                        "authenticated": false,
                        ...                                         -> all of the above parameters can be configured as default for all paths
                    }
                }
    */
    const backendForwarding = (req, res, next) => {
        var backendConfig = BackendRoutingService.getConfigForBackendUrl(req.baseUrl, '/apps')
        if (!backendConfig) {
            next()
            return
        }

        var user = req[TOKEN_PROPERTY]

        var authRequired = backendConfig.authenticated
                || (backendConfig.permissions && backendConfig.permissions.length)

        if (authRequired && !user) {
            if (backendConfig.onUnAuthenticated) {
                res.status(401).send()
                return
            }

            res.redirect(`/login?url=${req.originalUrl}`)
            return
        }

        user.scope = user.scope ? user.scope.split(',') : []

        if (backendConfig.permissions && !backendConfig.permissions.some(permission => user.scope.indexOf(permission) > -1)) {
            res.status(backendConfig.onUnAuthorized || 403).send()
            return
        }

        backendConfig.mappings = backendConfig.mappings || {}
        if (user) {
            req.headers[backendConfig.mappings.name || 'X-User'] = user.name
            req.headers[backendConfig.mappings.scope || 'X-Scope'] = user.scope
        }

        next()
    }

    const errorHandler = function(err, req, res, next) {
        console.error(`An error occurred: `, err)
        if (err.name === 'UnauthorizedError') {
            return res.status(401).send()
        }
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


Provider('AuthMiddleware', (AuthConfiguration, BackendRoutingService) => {

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