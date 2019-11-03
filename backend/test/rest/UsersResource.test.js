var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')
var njs = require('@radyak/njs')


describe('Users Resource', () => {

    beforeEach((done) => {
        // AppTestUtil.clearModel('User').then(() => {
        //     done()
        // })
        AppTestUtil.clearDb('User').then(() => {
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
            AppTestUtil.clearModel('User').then(() => {
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

        AppTestUtil
            .asUser('admin', ['admin'])

            .post('/api/admin/users', {
                username: 'user',
                password: 'password',
                passwordRepeat: 'password'
            })

            .end((err, res) => {
                expect(res.statusCode).to.equal(200)

                let user = res.body
                expect(user).to.deep.include({
                    permissions: [],
                    username: 'user'
                })

                return njs.User
                    .then(User => {
                        return User.find({})
                    })
                    .then(users => {
                        
                        expect(users.length).to.equal(1)
                        expect(user).to.deep.include({
                            permissions: [],
                            username: 'user'
                        })
                        done()
                    })
            })
    })

})