var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')


describe('Config Resource', () => {

    before((done) => {
        AppTestUtil.start().then(() => {
            done()
        })
    })

    after((done) => {
        AppTestUtil.stop().then(() => {
            done()
        })
    })

    it('should protect config with AuthN', (done) => {
        AppTestUtil
            .get('/api/admin/config')

            .end((err, res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({})
                done()
            })
    })

    it('should protect config with AuthZ - admin role', (done) => {
        AppTestUtil
            .asUser('admin', ['any'])
            
            .get('/api/admin/config')

            .end((err, res) => {
                expect(res.statusCode).to.equal(403)
                expect(res.body).to.deep.equal({
                    "error": "Forbidden"
                })
                done()
            })
    })

    it('should retrieve config', (done) => {
        AppTestUtil
            .asUser('admin', ['admin'])

            .get('/api/admin/config')

            .end((err, res) => {
                console.log(err)
                expect(res.statusCode).to.equal(200)
                done()
            })
    })
    
})