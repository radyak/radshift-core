
Provider('Initializer', (AuthService) => {

    return {
        run: () => {
            AuthService.registerNewUser({
                username: 'admin',
                password: 'admin',
                passwordRepeat: 'admin',
                permissions: ['admin']
            }).then(admin => {
                console.error(`Created default user "admin" - CHANGE THE PASSWORD !!!`)
            }).catch(err => {
                console.log(`Could not create default user "admin": ${err.errors.username.message}`)
            })
        }
    }

})
