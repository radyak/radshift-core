
Provider('Initializer', (AuthService, Permission) => {

    return {
        run: () => {

            let permission = new Permission({
                name: 'admin'
            })
            permission.save().then((permission) => {
                console.log(`Created permission "admin"`)
            }).catch(err => {
                console.log(`Could not create permission "admin": ${err.errors.name.message}`)
            })

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
