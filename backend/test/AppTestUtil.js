var njs = require('@radyak/njs')
var supertest = require('supertest');


let APP
let AUTH_SERVICE
let REQUEST
let TOKEN


class AppTestUtil {
    
    start() {

        return new Promise((resolve, reject) => {
            njs
            .configure({
                useGlobals: true
            })
            .profiles('dev-local', 'dev')
            .scan([
                'src/dependencies'
            ])
            .start((App, Initializer, AuthService) => {
                APP = App
                AUTH_SERVICE = AuthService
                
                Initializer.run()
                resolve()
            })
        })
    
    }

    stop() {
        return new Promise((resolve, reject) => {
            njs.clear()
            resolve()
        })
    }

    asUser(username, permissions) {
        TOKEN = AUTH_SERVICE.generateJWT({
            username: username,
            permissions: permissions
        })
        return this
    }

    get(path) {
        REQUEST = supertest(APP).get(path)
        this.addHeaders()
        return this
    }

    post(path) {
        REQUEST = supertest(APP).post(path)
        this.addHeaders()
        return this
    }

    put(path) {
        REQUEST = supertest(APP).put(path)
        this.addHeaders()
        return this
    }

    delete(path) {
        REQUEST = supertest(APP).delete(path)
        this.addHeaders()
        return this
    }

    addHeaders() {
        if (TOKEN) {
            REQUEST.set({ Authorization: `Bearer ${TOKEN}` })
        }
    }

    set(headers) {
        REQUEST.set(headers)
        return this
    }

    end(endFunction) {
        REQUEST.end((err, res) => {
            endFunction(err, res)
        })
        REQUEST = undefined
        TOKEN = undefined
    }

}

module.exports = new AppTestUtil()