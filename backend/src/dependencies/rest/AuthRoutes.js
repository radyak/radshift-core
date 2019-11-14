const passport = require('passport')
const express = require('express')
const router = express.Router()

const TOKEN_PROPERTY = 'user'

Provider('AuthRoutes', (AuthService, BackendRoutingService, AuthMiddleware) => {

    router.post('/login', (req, res, next) => {

        // TODO: Refactor to AuthService (?)

        const user = req.body

        if (!user.username || !user.password) {
            return res.status(400).json({
                errors: [
                    'username and password are required'
                ],
            })
        }

        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
            if (err) {
                return next(err)
            }

            if (passportUser) {
                const token = AuthService.generateJWT(passportUser)
                return res.status(200).send({
                    token: token
                })
            }

            return res.status(401).send()
        })(req, res, next)
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
    router.get('/authenticate', AuthMiddleware.authenticatedOptional, (req, res, next) => {
        
        var hostname = req.headers['x-forwarded-host']
        var path = req.headers['x-forwarded-uri']
        var protocol = req.headers['x-forwarded-proto']
        var method = req.headers['x-forwarded-method']
        var ip = req.headers['x-forwarded-for']

        var backendConfig = BackendRoutingService.getConfigByHostname(hostname, path)

        if (!backendConfig) {
          console.warn(`No backend config found for ${hostname}${path}`)
          res.status(204).send()
        }

        var user = req[TOKEN_PROPERTY]

        var isAuthRequired = backendConfig.authenticated
                || (backendConfig.permissions && backendConfig.permissions.length)

        if (isAuthRequired && !user) {
            console.warn(`Not authenticated for ${hostname}${path}`)

            if (backendConfig.onUnAuthenticated) {
                res.status(401).send()
                return
            }

            console.log('Would redirect here to login, but ...')
            res.status(401).send()
            // res.redirect(`/login?url=${req.originalUrl}`)
            return
        }

        let userPermissions = user.scope ? user.scope.split(',') : []

        if (backendConfig.permissions && !backendConfig.permissions.some(permission => userPermissions.indexOf(permission) > -1)) {
            console.warn(`User ${user} not authorized for ${hostname}/${path}`)
            res.status(backendConfig.onUnAuthorized || 403).send()
            return
        }

        backendConfig.mappings = backendConfig.mappings || {}
        if (user) {
            res.header(backendConfig.mappings.name || 'X-User', user.name)
            res.header(backendConfig.mappings.scope || 'X-Scope', user.scope)
        }

        res.status(204).send()

    })

    router.use('/*', (req, res, next) => {
        res.status(404).send()
    })

    return router
})
