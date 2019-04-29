const request = require('request')

const BASE_URL = process.env.RADHUB_URL

class DockerApiClient {

  request(options) {
    options.url = options.url || `${BASE_URL}${options.path}`
    delete options.path
    options.headers = options.headers || {}
    options.headers.Host = 'localhost'
    return new Promise((resolve, reject) => {
      request(options, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  getAll(filter) {
    return this.request({
      method: 'GET',
      path: '/api/backends' + (filter ? `?filter=${filter}` : '')
    })
  }

}

module.exports = DockerApiClient
