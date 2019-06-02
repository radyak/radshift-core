var chai = require('chai')
var expect = chai.expect
var AppTestUtil = require('../AppTestUtil')


describe('Admin Resource', () => {

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

    // it('should retrieve users', (done) => {
    //     AppTestUtil
    //         .asUser('admin', ['admin'])

    //         .get('/api/admin/users')

    //         .end((err, res) => {
    //             expect(res.statusCode).to.equal(200)

    //             let users = res.body
    //             expect(users.length).to.equal(1)
    //             expect(users[0]).to.deep.include({
    //                 permissions: ["admin"],
    //                 username: "admin"
    //             })
                
    //             done()
    //         })
    // })

})