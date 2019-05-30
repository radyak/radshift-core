const passport = require('passport')
const express = require('express')
const router = express.Router()

Provider('AuthRoutes', (AuthService) => {

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

    router.use('/*', (req, res, next) => {
        res.status(404).send()
    })

    return router
})
