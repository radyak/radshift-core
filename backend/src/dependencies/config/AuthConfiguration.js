const passport = require('passport')
const LocalStrategy = require('passport-local')

Provider('AuthConfiguration', (UserService) => {

    return passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, (username, password, done) => {
        UserService.findByName(username)
            .then((user) => {
                if (!user || !UserService.validatePassword(user, password)) {
                    return done(null, false, {
                        errors: {
                            'username or password': 'is invalid'
                        }
                    })
                }

                return done(null, user)
            }).catch(done)
    }))

})