var express = require('express')
var router = express.Router()

Configuration('AdminRoutes', (AdministrationService, AuthService, User, Permission) => {
  
  router.get('/config', (req, res) => {
    AdministrationService.getConfig().then(config => {
      res.status(200).send(config)
    })
  })
  
  router.put('/config', (req, res) => {
    AdministrationService.saveConfig(req.body)
    .then(config => {
      res.status(200).send(config)
    })
    .catch(error => {
      console.log('Error', error)
      res.status(400).send(error)
    })
  })
  
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
      console.error('Err', err)
      return res.status(400).json(err).send()
    }
  })
  
  router.put('/users/:username', (req, res) => {
    let username = req.params.username
    let user = req.body
    console.log(`Updating user ${username}`, user)
    AuthService.changeUserPermissions(username, user.permissions)
        .then((result) => {
          if(result.n === 0) {
            return res.status(404).json({
              username: `User '${username}' not found`
            }).send()
          }
          res.status(204).send()
        })
        .catch(err => res.status(400).json(err).send())
  })
  
  router.delete('/users/:username', (req, res) => {
    let username = req.params.username
    
    User.deleteOne({
      username: username
    })
    .then((result) => {
      console.log(result)
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
      Promise.all([
        // User.find(),
        Permission.deleteMany({})  
      ])
      .then((values) => {
        // let users = values[0]
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
      console.error('Err', err)
      return res.status(400).json(err).send()
    }
  })
  
  // router.delete('/permissions/:permission', (req, res) => {
  //   let permissionName = req.params.permission

  //   Permission.deleteOne({
  //     name: permissionName
  //   })
  //   .then((result) => {
  //     console.log(permissionName, result)
  //     if(result.n === 0) {
  //       return res.status(404).json({
  //         permission: `Permission '${permissionName}' not found`
  //       }).send()
  //     }
  //     res.status(204).send()
  //   })
  //   .catch(err => res.status(400).json(err).send())
  // })

  router.use('/*', (req, res, next) => {
      res.status(404).send()
  })

  return router
})
