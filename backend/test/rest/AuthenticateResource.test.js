var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')


describe('Authenticate Resource', () => {

    before((done) => {
        AppTestUtil.start(() => {
            done()
        })
    })

    after((done) => {
        AppTestUtil.stop(() => {
            done()
        })
    })

    describe('Basic functionality', () => {
            
        it('should reject request if required header is missing', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    // 'x-forwarded-host' is missing
                    'x-forwarded-uri': '/some/test/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(400)
                    done()
                })
        })


        it('should grant access if no backend config can be found', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'nonregisteredapp',
                    'x-forwarded-uri': '/some/test/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    done()
                })
        })


        it('should grant access if backend config contains no security', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'appwithoutsecurity',
                    'x-forwarded-uri': '/some/test/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    done()
                })
        })


        it('should grant access if backend config contains empty security', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'appwithemptysecurity',
                    'x-forwarded-uri': '/some/test/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    done()
                })
        })

    })
    

    describe('AuthN (Authentication)', () => {

        it('should deny access to protected resource for unauthenticated request', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body.loginUrl).to.equal('https://core.test-domain.net/login')
                    done()
                })
        })


        it('should grant access to protected resource and provide auth headers for authenticated request', (done) => {
            AppTestUtil
                .asUser('user')
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    expect(res.headers['x-user']).to.equal('user')
                    expect(res.headers['x-scope']).to.equal('')
                    done()
                })
        })


        it('should grant access to explicitly un-protected pattern if no credentials provided', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/static/app.js?timestamp=2019-17-12T22:44:19.000Z',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    done()
                })
        })


        it('should redirect unauthenticated request from protected resource if redirectUnauthenticated active', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/api/redirectpath/andsoon',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(302)
                    expect(res.headers['location']).to.equal('https://core.test-domain.net/login?origin=https%3A%2F%2Ftestapp%2Fapi%2Fredirectpath%2Fandsoon')
                    done()
                })
        })

    })
    

    describe('AuthZ (Authorization)', () => {

        it('should deny access to protected resource for unauthenticated request', (done) => {
            AppTestUtil
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/api/authz-protected/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body.loginUrl).to.equal('https://core.test-domain.net/login')
                    done()
                })
        })


        it('should deny access to protected resource for unauthorized request (no permissions)', (done) => {
            AppTestUtil
                .asUser('user')
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/api/authz-protected/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(403)
                    done()
                })
        })


        it('should deny access to protected resource for unauthorized request (no matching permissions)', (done) => {
            AppTestUtil
                .asUser('user', ['permission1', 'permission2', 'permission3'])
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/api/authz-protected/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(403)
                    done()
                })
        })


        it('should grant access to protected resource and provide auth headers for authorized request (one matching permission)', (done) => {
            AppTestUtil
                .asUser('user', ['permission1', 'permission2', 'admin2'])
                .get('/api/auth/authenticate')
                .set({
                    'x-forwarded-host': 'testapp',
                    'x-forwarded-uri': '/api/authz-protected/path',
                    'x-forwarded-proto': 'https'
                })
                .end((err, res) => {
                    expect(res.statusCode).to.equal(204)
                    expect(res.headers['x-custom-user']).to.equal('user')
                    expect(res.headers['x-custom-roles']).to.equal('permission1 permission2 admin2')
                    done()
                })
        })

    })
    
})