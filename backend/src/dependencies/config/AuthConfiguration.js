const passport = require('passport')
const LocalStrategy = require('passport-local')

Configuration('AuthConfiguration', (Users) => {

    return passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, (username, password, done) => {
        Users.findOne({ username })
            .then((user) => {
                if (!user || !user.validatePassword(password)) {
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