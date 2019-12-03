var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')
var njs = require('@radyak/njs')


describe('Auth Resource', () => {

    beforeEach((done) => {
        AppTestUtil.clearDb().then(() => {
            
            AppTestUtil
                .asUser('admin', ['admin'])

                .post('/api/admin/users', {
                    username: 'user',
                    password: 'password'
                })

                .end((err, res) => {
                    expect(res.statusCode).to.equal(200)
                    done()
                })
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


    it('should log a user in', (done) => {
                
        AppTestUtil
            .post('/api/auth/login', {
                username: 'user',
                password: 'password'
            })

            .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body.token).to.be.a('string').to.have.length(161)
                expect(res.headers['set-cookie'][0]).to.contain(res.body.token)
                done()
            })
        
    })


    it('should deny log in with invalid credentials', (done) => {
                
        AppTestUtil
            .post('/api/auth/login', {
                username: 'user',
                password: 'wrongpassword'
            })

            .end((err, res) => {
                expect(res.statusCode).to.equal(401)
                done()
            })
        
    })

})