var express = require('express')
var router = express.Router()

Configuration('AuthRoutes', (OAuthServerMiddleware, ClientsService, UserService) => {
  router.post('/clients', (req, res) => {
    var clientInfo = req.body

    // TODO: which fields must be generated?
    ClientsService.createClient(
      clientInfo.clientId,
      clientInfo.redirectUris,
      clientInfo.grants
    )
      .then((client) => {
        res.status(200).send(client)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  })

  router.post('/users', (req, res) => {
    var registration = req.body

    UserService.createUser(
      registration.username,
      registration.email,
      registration.password,
      registration.passwordRepeat
    )
      .then((user) => {
        res.status(200).send(user)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  })

  router.use('/token', OAuthServerMiddleware.token())
  router.use('/authorize', OAuthServerMiddleware.authorize())

  return router
})
