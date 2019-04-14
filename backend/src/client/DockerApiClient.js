const request = require('request')

const BASE_URL = 'http://unix:/var/run/docker.sock:/v' + (process.env.DOCKER_API_VERSION || '1.30')
const IMAGE_REPO_PREFIX = 'radyak/'

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

  stream(options) {
    options.url = options.url || `${BASE_URL}${options.path}`
    delete options.path
    options.headers = options.headers || {}
    options.headers.Host = 'localhost'
    return request(options)
  }


  /**************
   * CONTAINERS *
   **************/


  getAllContainerDetails(onlyRunning = false) {
    let qs = {}
    qs.all = (onlyRunning ? 0 : 1)
    return this.request({
      method: 'GET',
      path: `/containers/json`,
      qs: qs
    })
  }

  getContainerDetails(name) {
    return this.request({
      method: 'GET',
      path: `/containers/${name}/json`
    })
  }

  createContainer(config, name) {
    return this.request({
      method: 'POST',
      path: `/containers/create`,
      body: {
        'Image': `${IMAGE_REPO_PREFIX}${config.image}`,
        'Env': [

        ]
      }
    })
  }

  stopContainer(name) {
    return this.request({
      method: 'POST',
      path: `/containers/${name}/stop`
    })
  }

  startContainer(name) {
    return this.request({
      method: 'POST',
      path: `/containers/${name}/start`
    })
  }

  removeContainer(name) {
    return this.request({
      method: 'DELETE',
      path: `/containers/${name}`
    })
  }


  /**********
   * IMAGES *
   **********/

  removeImage(name) {
    return this.request({
      method: 'DELETE',
      path: `/images/${name}`
    })
  }

  pullImage(name, onDataChunkCallback) {
    var stream = this.stream({
      method: 'POST',
      path: `/images/create?fromImage=${IMAGE_REPO_PREFIX}${name}`
    })

    
    return new Promise((resolve, reject) => {

      stream.on('close', () => {
        resolve()
      })

      stream.on('error', (err) => {
        reject(err)
      })

      stream.on('data', (data) => {
        var chunk = JSON.parse(data.toString('utf8'))

        if (onDataChunkCallback) {
          onDataChunkCallback(chunk)
        }

        if (!chunk.status && !!chunk.message) {
          reject(chunk)
        }
      })

    })
  }

  createContainer(name) {
    /*
      For some reason, Docker API requires a string as body, but Content-Type: application/json for this resource
      #wtf
     */
    return this.request({
      method: 'POST',
      path: `/containers/create?name=${name}`,
      body: JSON.stringify({
        'Image': `${IMAGE_REPO_PREFIX}${name}`
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}

module.exports = DockerApiClient
