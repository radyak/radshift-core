var njs = require('@radyak/njs')
var supertest = require('supertest');


let APP
let AUTH_SERVICE
let USER_DATABASE
let REQUEST
let TOKEN


class AppTestUtil {
    
    start(postStartHook) {

        let result = new Promise((resolve, reject) => {
            njs
            .configure({
                useGlobals: true
            })
            .profiles('dev-local', 'dev')
            .scan([
                'src/dependencies'
            ])
            .start((App, AuthService, UserDatabase) => {
                APP = App
                AUTH_SERVICE = AuthService
                USER_DATABASE = UserDatabase

                resolve(App)
            })
        })

        return postStartHook ?
            result.then(() => {
                postStartHook()
            })

            : result
    
    }

    stop(preStopHook) {
        let result = preStopHook ? preStopHook() : null
        
        return result ? 
            result.then(() => {
                njs.clear()
                resolve()
            })

            :  new Promise((resolve, reject) => {
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

    post(path, body) {
        REQUEST = supertest(APP).post(path).send(body)
        this.addHeaders()
        return this
    }

    put(path, body) {
        REQUEST = supertest(APP).put(path).send(body)
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

    clearDb() {
        return new Promise((resolve, reject) => {
            USER_DATABASE.deleteAll()
            resolve()
        })
    }

}

module.exports = new AppTestUtil()