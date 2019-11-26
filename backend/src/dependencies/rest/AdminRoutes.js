var express = require('express')
var router = express.Router()

Provider('AdminRoutes', (AuthService, User, Permission) => {
  
  router.get('/users', (req, res) => {
    User.find((err, users) => {
      res.status(200).send(users)
    })
  })
  
  router.post('/users', (req, res) => {
    try {
      AuthService.registerNewUser(req.body)
          .then((user) => res.status(200).send(user))
          .catch(err => res.status(400).send(err))
    } catch (err) {
      return res.status(400).json(err).send()
    }
  })
  
  router.put('/users/:username/permissions', (req, res) => {
    let username = req.params.username
    let user = req.body

    AuthService.changeUserPermissions(username, user.permissions)
        .then(result => {
          if(result.n === 0) {
            return res.status(400).send({
              username: `User '${username}' not found`
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
    let user = req.body

    AuthService.changeUserPassword(user)
        .then((result) => {
          if (!result) {
            return res.status(400).send({
              username: `Could not change password for user '${username}'`
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
    
    User.deleteOne({
      username: username
    })
    .then((result) => {
      if(result.n === 0) {
        return res.status(404).json({
          username: `User '${username}' not found`
        }).send()
      }
      res.status(204).send()
    })
    .catch(err => res.status(404).json(err).send())
  })
  
  router.get('/permissions', (req, res) => {
    Permission.find((err, permissions) => {
      res.status(200).send(permissions)
    })
  })
  
  router.post('/permissions', (req, res) => {
    try {
      Permission.deleteMany({})  
      .then(() => {
        let newPermissions = req.body.map(
          newPermission => {
            let permission = new Permission({
              name: newPermission.name
            })
            permission.save()
            return permission
          }
        )
        return res.status(200).send(newPermissions)
      })
      .catch(err => res.status(400).send(err))
    } catch (err) {
      return res.status(400).json(err).send()
    }
  })

  router.use('/*', (req, res, next) => {
      res.status(404).send()
  })

  return router
})
