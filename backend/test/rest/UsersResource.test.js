var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')
var njs = require('@radyak/njs')


describe('Users Resource', () => {

    beforeEach((done) => {
        AppTestUtil.clearDb().then(() => {
            done()
        })
    })

    before((done) => {
        AppTestUtil.start(() => {
            done()
        })
    })

    after((done) => {
        AppTestUtil.stop(() => {
            AppTestUtil.clearDb().then(() => {
                done()
            })
        })
    })

    it('should be protected with AuthN', (done) => {
        AppTestUtil
            .get('/api/admin/users')

            .end((err, res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({})
                done()
            })
    })

    it('should be protected with AuthZ - admin role', (done) => {
        AppTestUtil
            .asUser('admin', ['any'])
            
            .get('/api/admin/users')

            .end((err, res) => {
                expect(res.statusCode).to.equal(403)
                expect(res.body).to.deep.equal({
                    'error': 'Forbidden'
                })
                done()
            })

    })

    it('should retrieve empty users', (done) => {

        AppTestUtil
            .asUser('admin', ['admin'])

            .get('/api/admin/users')

            .end((err, res) => {
                expect(res.statusCode).to.equal(200)

                let users = res.body
                expect(users.length).to.equal(0)
                
                done()
            })
    })

    it('should create a new user', (done) => {
        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {

            AppTestUtil
            .asUser('admin', ['admin'])

            .get('/api/admin/users')

            .end((err, res) => {
                expect(res.statusCode).to.equal(200)

                let users = res.body
                expect(users).to.deep.equal([
                    {
                        permissions: [],
                        username: 'user'
                    }
                ])

                done()
            })

        })
    })

    it('should not create a user with duplicate name', (done) => {
        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {

            AppTestUtil
                .asUser('admin', ['admin'])

                .post('/api/admin/users', {
                    username: 'user',
                    password: 'anotherpassword',
                    passwordRepeat: 'anotherpassword'
                })

                .end((err, res) => {
                    expect(res.statusCode).to.equal(400)

                    done()

                })
        })
    })

    it('should not create a user with wrong passwordRepeat', (done) => {

        AppTestUtil
            .asUser('admin', ['admin'])

            .post('/api/admin/users', {
                username: 'user',
                password: 'password',
                passwordRepeat: 'anotherpassword'
            })

            .end((err, res) => {
                expect(res.statusCode).to.equal(400)

                let user = res.body
                expect(user).to.deep.equal({
                    error: 'Password and password repition must be identical'
                })

                done()
            })
    })

    it('should update a users permissions', (done) => {

        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {
                
            AppTestUtil
                .asUser('admin', ['admin'])

                .put('/api/admin/users/user/permissions', [
                    'newPermission'
                ])

                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    done()
                })
        })
    })

    it('should not update non-existing users permissions', (done) => {

        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {
            
            AppTestUtil
                .asUser('admin', ['admin'])

                .put('/api/admin/users/nonexistinguser/permissions', [
                    'newPermission'
                ])

                .end((err, res) => {
                    expect(res.statusCode).to.equal(404)
                    done()
                })
        })
    })

    it('should update a users password', (done) => {

        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {
          
            AppTestUtil
                .asUser('admin', ['admin'])

                .put('/api/admin/users/user/password', {
                    password: 'newPassword',
                    passwordRepeat: 'newPassword'
                })

                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    done()
                })
        })
    })

    it('should not update a non-existing users password', (done) => {

        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {
            
            AppTestUtil
                .asUser('admin', ['admin'])

                .put('/api/admin/users/nonexistinguser/password', {
                    password: 'newPassword',
                    passwordRepeat: 'newPassword'
                })

                .end((err, res) => {
                    expect(res.statusCode).to.equal(404)
                    done()
                })
        })
    })

    it('should not update a users password with wrong passwordRepeat', (done) => {

        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {
                
            AppTestUtil
                .asUser('admin', ['admin'])

                .put('/api/admin/users/user/password', {
                    password: 'newPassword',
                    passwordRepeat: 'anotherNewPassword'
                })

                .end((err, res) => {
                    expect(res.statusCode).to.equal(400)
                    done()
                })
        })
    })

    it('should delete a user', (done) => {

        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {
                
            AppTestUtil
                .asUser('admin', ['admin'])

                .delete('/api/admin/users/user')

                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    done()
                })
        })
    })

    it('should not delete a non-existing user', (done) => {

        createUserAndCheck({
            username: 'user',
            password: 'password',
            passwordRepeat: 'password'
        }, () => {
                
            AppTestUtil
                .asUser('admin', ['admin'])

                .delete('/api/admin/users/nonexistinguser')

                .end((err, res) => {
                    expect(res.statusCode).to.equal(404)
                    done()
                })
        })
    })


    const createUserAndCheck = (user, check) => {
        AppTestUtil
            .asUser('admin', ['admin'])

            .post('/api/admin/users', user)

            .end((err, res) => {
                expect(res.statusCode).to.equal(200)

                let user = res.body
                expect(user).to.deep.equal({
                    permissions: [],
                    username: user.username
                })

                if (check) {
                    check()
                }
            })
        
    }

})