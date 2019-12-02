var express = require('express')
var router = express.Router()

Provider('AdminRoutes', (AuthService, UserService) => {
  
  router.get('/users', (req, res) => {
    UserService.findAll().then((users) => {
      res.status(200).send(users)
    })
  })
  
  router.get('/users/:name', (req, res) => {
    UserService.findByName(req.params.name).then((user) => {
      res.status(200).send(user)
    })
  })
  
  router.post('/users', (req, res) => {
    try {
      AuthService.registerNewUser(req.body)
          .then((user) => res.status(200).send(user))
          .catch(err => res.status(400).json({error: err}).send())
    } catch (err) {
      return res.status(400).json({
        error: err
      }).send()
    }
  })
  
  router.put('/users/:username/permissions', (req, res) => {
    let username = req.params.username
    let permissions = req.body

    AuthService.changeUserPermissions(username, permissions)
        .then(result => {
          if(!result) {
            return res.status(404).send({
              error: `User '${username}' not found`
            })
          }
          res.status(204).send()
        })
        .catch(err => {
          res.status(400).json(err).send()
        })
  })

  router.put('/users/:username/password', (req, res) => {
    let username = req.params.username
    let passwordChangeRequest = req.body

    AuthService.changeUserPassword(
      username,
      passwordChangeRequest.password,
      passwordChangeRequest.passwordRepeat
    )
        .then((result) => {
          if (!result) {
            return res.status(404).send({
              error: `Could not change password for user '${username}'`
            })
          }
          res.status(204).send()
        })
        .catch(err => {
          res.status(400).json(err).send()
        })
  })
  
  router.delete('/users/:username', (req, res) => {
    let username = req.params.username
    
    UserService.deleteByUsername(username)
      .then((result) => {

        if(!result) {
          return res.status(404).json({
            error: `User '${username}' not found`
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
