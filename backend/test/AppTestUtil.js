var njs = require('@radyak/njs')
var supertest = require('supertest');


let APP
let AUTH_SERVICE
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
            .start((App, AuthService) => {
                APP = App
                AUTH_SERVICE = AuthService

                resolve()
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

    clearModel(modelName) {
        return njs[modelName].then((Model) => {
            return Model.deleteMany({})
        })
    }

    clearDb() {
        return Promise.all([
            njs.User
        ]).then(values => {

            return Promise.all([
                values[0].deleteMany({})
            ])
            
        })
    }

}

module.exports = new AppTestUtil()