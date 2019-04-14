class UserService {
  constructor (OAuthUsers, PasswordHashService) {
    this.OAuthUsers = OAuthUsers
    this.PasswordHashService = PasswordHashService
  }

  createUser (username, email, password, passwordRepeat) {
    return new Promise((resolve, reject) => {
      if (password !== passwordRepeat) {
        reject(new Error('Password and password repeat differ'))
        return
      }

      // TODO: further validations
      var OAuthUser = this.OAuthUsers
      var newUser = new OAuthUser({
        email: email,
        password: this.PasswordHashService.encrypt(password),
        username: username
      })

      newUser.save((err, user) => {
        if (err) {
          console.error(err)
          // TODO: Refactor mongoose validation errors (or custom validation)
          reject(err.errors)
        } else {
          console.log(`Created new user`)
          resolve(user)
        }
      })
    })
  }

  /**
     * Get user.
     * required if the password grant
     *
     * TODO: elaborate later
     */
  getUserByLogin (username, password) {
    return this.OAuthUsers.findOne({
      username: username
    })
      .lean()
      .then((user) => {
        if (this.PasswordHashService.check(password, user.password)) {
          return user
        } else {
          throw new Error({
            message: 'No matching user'
          })
        }
      })
  }
}

module.exports = UserService
