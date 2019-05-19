
Provider('Initializer', (AuthService, Permission) => {

    return {
        run: () => {

            Permission.findOne({
                name: 'admin'
            }).then(adminPermission => {
                if (!adminPermission) {
                    let permission = new Permission({
                        name: 'admin'
                    })
                    return permission.save()
                } else {
                    console.log(`Permission 'admin' already exists`)
                }
            }).then(newAdminPermission => {
                if (newAdminPermission) {
                    console.log(`Created permission 'admin'`)
                }
            }).catch(err => {
                console.log(`Could not create permission 'admin': `, err)
            })

            AuthService.registerNewUser({
                username: 'admin',
                password: 'admin',
                passwordRepeat: 'admin',
                permissions: ['admin']
            }).then(admin => {
                console.error(`Created default user 'admin' - CHANGE THE PASSWORD !!!`)
            }).catch(err => {
                console.log(`Could not create default user 'admin': ${err.errors.username.message}`)
            })
        }
    }

})
