var chai = require('chai')
var expect = chai.expect
var njs = require('@radyak/njs')
var request = require('request')


const PORT = 3030
const BASE_URI = `http://localhost:${PORT}/api`

let SERVER
let GENERATE_TOKEN

describe('Admin Resource', () => {

    before((done) => {

        process.env.PORT = PORT

        njs
        .configure({
            useGlobals: true
        })
        .profiles('dev-local', 'dev')
        .scan([
            'src/dependencies'
        ])
        .start((Server, Initializer, AuthService) => {
            SERVER = Server
            GENERATE_TOKEN = (username, permissions) => {
                return AuthService.generateJWT({
                    username: username,
                    permissions: permissions
                })
            }
            
            Initializer.run()
            Server.start()
            console.log('Started server')

            done()
        })

    })

    after(() => {
        SERVER.stop()
        console.log('Stopped server')
        njs.clear()
    })

    it('should retrieve config', (done) => {
        request({
            method: 'GET',
            url: `${BASE_URI}/admin/config`,
            headers: {
                Authorization: `Bearer ${GENERATE_TOKEN('admin', ['admin'])}`
            }
        }, (err, res) => {
            expect(res.statusCode).to.equal(200)
            done()
        })
    })

    it('should retrieve users', (done) => {
        request({
            method: 'GET',
            url: `${BASE_URI}/admin/users`,
            headers: {
                Authorization: `Bearer ${GENERATE_TOKEN('admin', ['admin'])}`
            }
        }, (err, res) => {
            expect(res.statusCode).to.equal(200)

            let users = JSON.parse(res.body)
            expect(users.length).to.equal(1)
            expect(users[0]).to.deep.include({
                permissions: ["admin"],
                username: "admin"
            })
            
            done()
        })
    })


})