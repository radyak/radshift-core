var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')


const loginWithWrongCredentials = () => {

    return new Promise((resolve, reject) => {

        AppTestUtil
            .post('/api/auth/login', {
                username: 'user',
                password: 'wrongPassword'
            })
            .set({
                'x-real-ip': '93.205.193.14'
            })

            .end((err, res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({
                    blockedUntil: 0,
                    message: 'Username and/or password invalid'
                })
                resolve()
            })
    })
}


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
                expect(res.body).to.deep.equal({
                    blockedUntil: 0,
                    message: 'Username and/or password invalid'
                })
                done()
            })

    })


    it('should block a user after too many auth attempts', (done) => {

        loginWithWrongCredentials()
        .then(() => loginWithWrongCredentials())
        .then(() => loginWithWrongCredentials())
        .then(() => loginWithWrongCredentials())
        .then(() => {

            // Login with wrong credentials for the 5th time: IP gets blocked

            return new Promise((resolve, reject) => {
                AppTestUtil
                    .post('/api/auth/login', {
                        username: 'user',
                        password: 'wrongPassword'
                    })
                    .set({
                        'x-real-ip': '93.205.193.14'
                    })

                    .end((err, res) => {
                        expect(res.statusCode).to.equal(401)
                        expect(res.body.message).to.equal('Too many auth attempts')

                        let blockedUntilActual = new Date(res.body.blockedUntil).getTime()
                        let blockedUntilExpected = new Date().getTime() + 1500
                        let delta = Math.abs( blockedUntilActual - blockedUntilExpected )
                        // Tolerance of 0.2 seconds
                        expect( delta < 200 ).to.be.true
                                
                        resolve()
                    })
            })

        })

        .then(() => {

            // Login from another IP still works
            
            return new Promise((resolve, reject) => {
                AppTestUtil
                    .post('/api/auth/login', {
                        username: 'user',
                        password: 'Pa$sw0rd'
                    })
                    .set({
                        'x-real-ip': '108.34.200.91'
                    })

                    .end((err, res) => {
                        expect(res.statusCode).to.equal(200)
                        expect(res.body.token).to.be.a('string').to.have.length(161)
                        expect(res.headers['set-cookie'][0]).to.contain(res.body.token)
                        resolve()
                    })
            })
        })

        .then(() => {

            // Wait for 1.5 seconds (done must be called within 2 seconds)

            return new Promise((resolve, reject) => {
                setTimeout(() => { resolve() }, 1500)
            })

        })
        
        .then(() => {

            // Try log in from original IP again with valid credentials after block interval works

            AppTestUtil
                .post('/api/auth/login', {
                    username: 'user',
                    password: 'Pa$sw0rd'
                })
                .set({
                    'x-real-ip': '93.205.193.14'
                })

                .end((err, res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.token).to.be.a('string').to.have.length(161)
                    expect(res.headers['set-cookie'][0]).to.contain(res.body.token)
                    done()
                })
        })
        
    })

})