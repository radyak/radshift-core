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


    it('should reject request if required header is missing', (done) => {
        AppTestUtil
            .get('/api/auth/authenticate')
            .set({
                // 'x-forwarded-host' is missing
                'x-forwarded-uri': '/some/test/path',
                'x-forwarded-proto': 'http'
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
                'x-forwarded-proto': 'http'
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
                'x-forwarded-proto': 'http'
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
                'x-forwarded-proto': 'http'
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(204)
                done()
            })
    })

})