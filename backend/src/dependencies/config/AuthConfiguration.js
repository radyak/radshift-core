const passport = require('passport')
const LocalStrategy = require('passport-local')

Provider('AuthConfiguration', (UserService) => {

    return passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, (username, password, done) => {
        UserService.validatePassword(username, password).then((user) => {
            if (!user) {
                return done(null, false, {
                    errors: {
                        error: 'Password is not valide'
                    }
                })
            }

            return done(null, user)
        }).catch(done)
    }))

})