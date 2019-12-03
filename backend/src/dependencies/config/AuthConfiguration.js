const passport = require('passport')
const LocalStrategy = require('passport-local')

Provider('AuthConfiguration', (UserDatabase) => {

    return passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    }, (username, password, done) => {
        UserDatabase.validatePassword(username, password).then((user) => {
            if (!user) {
                return done(null, false, {
                    error: 'Username and/or password is not valid'
                })
            }

            return done(null, user)
        }).catch(done)
    }))

})