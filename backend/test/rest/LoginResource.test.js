var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')


describe('Login Resource', () => {

    beforeEach((done) => {
        AppTestUtil.clearDb().then(() => {
            
            AppTestUtil
                .asUser('admin', ['admin'])

                .post('/api/admin/users', {
                    username: 'user',
                    password: 'Pa$sw0rd'
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
                password: 'Pa$sw0rd'
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
                password: 'wrongPa$sw0rd'
            })

            .end((err, res) => {
                expect(res.statusCode).to.equal(401)
                done()
            })
        
    })

})