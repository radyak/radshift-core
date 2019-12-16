const Logger = require('../../logging/Logger')

Provider('Initializer', (AuthService) => {

    return {
        run: () => {
            AuthService.registerNewUser(
                'admin', 'admin@M1N', ['admin']
            ).then(admin => {
                Logger.warn(`Created default user 'admin' - CHANGE THE PASSWORD !!!`)
            }).catch(err => {
                Logger.error(`Could not create default user 'admin': ${err}`)
            })
        }
    }

})
