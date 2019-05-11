var express = require('express')
var router = express.Router()

Configuration('AdminRoutes', (ConfigService, Users, AuthService, AuthMiddleware) => {
  
  router.get('/config', (req, res) => {
    ConfigService.getConfigSecure().then(config => {
      res.status(200).send(config)
    })
  })
  
  router.post('/config', (req, res) => {
    // ConfigService.getConfigSecure().then(config => {
    //   res.status(200).send(config)
    // })
    res.status(200).send()
  })
  
  router.get('/users', (req, res) => {
    Users.find((err, users) => {
      res.status(200).send(users)
    })
  })
  
  router.post('/users', (req, res) => {
    try {
      AuthService.registerNewUser(req.body)
          .then(() => res.status(204).send())
          .catch(err => res.status(400).json(err).send())
    } catch (err) {
      console.error('Err', err)
      return res.status(400).json(err).send()
    }
  })
  
  router.put('/users/:username/permissions', (req, res) => {
    let username = req.params.username
    AuthService.changeUserPermissions(username, req.body)
        .then((result) => {
          console.log(result)
          if(result.n === 0) {
            return res.status(404).json({
              username: `User '${username}' not found`
            }).send()
          }
          res.status(204).send()
        })
        .catch(err => res.status(400).json(err).send())
  })

  router.use('/*', (req, res, next) => {
      res.status(404).send()
  })

  return router
})
