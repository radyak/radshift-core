const mongoose = require('mongoose');
const passport = require('passport');

var express = require('express')
var router = express.Router()

Configuration('AuthRoutes', (User, AuthMiddleware, AuthService) => {

    router.post('/register', AuthMiddleware.optional, (req, res) => {
        const registration = req.body

        // TODO: extend registration

        if (!registration.password) {
            return res.status(400).json().send()
        }                
        const user = new User(registration);
        user.setPassword(registration.password);

        return user.save()
                .then(() => res.status(204).send())
                .catch(err => res.status(400).json(err).send());
    });


    router.post('/login', AuthMiddleware.optional, (req, res, next) => {
        const user = req.body;

        if (!user.username || !user.password) {
            return res.status(400).json({
                errors: [
                    'username and password are required'
                ],
            });
        }

        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
            if (err) {
                return next(err);
            }

            if (passportUser) {
                const token = AuthService.generateJWT(passportUser);
                // return res.header('Authorization', `Bearer ${token}`).status(204).send();
                return res.cookie('Authorization', `${token}`).status(204).send();
            }

            res.status(401).send();
        })(req, res, next);
    });

    return router
})
