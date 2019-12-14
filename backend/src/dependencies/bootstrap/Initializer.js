
Provider('Initializer', (AuthService) => {

    return {
        run: () => {
            AuthService.registerNewUser(
                'admin', 'admin@M1N', ['admin']
            ).then(admin => {
                console.log(`Created default user 'admin' - CHANGE THE PASSWORD !!!`)
            }).catch(err => {
                console.error(`Could not create default user 'admin': ${err}`)
            })
        }
    }

})
