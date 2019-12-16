const passport = require('passport')
const express = require('express')
const router = express.Router()

const Logger = require('../../logging/Logger')

const TOKEN_PROPERTY = 'user'
const COOKIE_CONFIG = {
    httpOnly: true,
    domain: process.env.HOST_DOMAIN,
    path: '/'
}

Provider('AuthRoutes', (AuthService, BackendService, AuthMiddleware) => {

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
                res.cookie('Authorization', token, COOKIE_CONFIG)
                    .status(200)
                    .send({
                        token: token
                    })
                return
            }

            return res.status(401).send()
        })(req, res, next)
    })

    router.put('/password', (req, res, next) => {

        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const username = req[TOKEN_PROPERTY].name

        if (!oldPassword || !newPassword) {
            return res.status(400)
                .json({
                    error: 'Old and new password are required'
                })
                .send()
        }

        AuthService.validatePassword(username, oldPassword)
            .then(user => {
                return AuthService.changeUserPassword(username, newPassword)
            })
            .then(user => {
                return res.status(204).send()
            })
            .catch(err => {
                Logger.error(err)
                return res.status(401).send()
            })
    })

    router.get('/logout', (req, res, next) => {
        return res.clearCookie('Authorization', COOKIE_CONFIG)
            .status(204)
            .send()
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
                                "redirectUnauthenticated": true,    -> optional; if true, redirect to "/login"; default false
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

        var backendConfig = BackendService.getConfigByHostname(hostname, path)

        if (!backendConfig) {
            Logger.info(`No backend config found for ${hostname}${path}`)
            res.status(204).send()
        }

        var user = req[TOKEN_PROPERTY]

        var isAuthRequired = backendConfig.authenticated
            || (backendConfig.permissions && backendConfig.permissions.length)

        if (isAuthRequired && !user) {
            Logger.debug(`Not authenticated for ${hostname}${path}`)

            let originalUrl = `${protocol}://${hostname}${path}`
            let encodedOriginalUrl = encodeURIComponent(originalUrl)

            const hostDomain = process.env.HOST_DOMAIN
            let loginBaseUrl = `${protocol}://core.${hostDomain}/login`
            let redirectUrl = `${loginBaseUrl}?origin=${encodedOriginalUrl}`

            if (backendConfig.redirectUnauthenticated) {
                Logger.debug(`Redirecting to ${redirectUrl}`)
                res.redirect(redirectUrl)
                return
            }

            res.status(401).json({
                loginUrl: loginBaseUrl
            }).send()
            return
        }

        let userPermissions = user && user.scope ? user.scope.split(',') : []

        if (backendConfig.permissions && !backendConfig.permissions.some(permission => userPermissions.indexOf(permission) > -1)) {
            Logger.debug(`User ${user} not authorized for ${hostname}/${path}`)
            res.status(403).send()
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
