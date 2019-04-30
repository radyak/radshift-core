const request = require('request')

const BASE_URL = 'http://unix:/var/run/docker.sock:/v' + (process.env.DOCKER_API_VERSION || '1.30')

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

  getContainerDetails(containerName) {
    return this.request({
      method: 'GET',
      path: `/containers/${containerName}/json`
    })
  }

  getContainerStats(containerName) {
    return this.request({
      method: 'GET',
      path: `/containers/${containerName}/stats?stream=false`
    })
  }

  createContainer(imageName, containerName) {
    /*
      For some reason, Docker API requires a string as body, but Content-Type: application/json for this resource
      #wtf
     */
    return this.request({
      method: 'POST',
      path: `/containers/create?name=${containerName}`,
      body: JSON.stringify({
        'Image': imageName,
        'Env': [

        ]
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  stopContainer(containerName) {
    return this.request({
      method: 'POST',
      path: `/containers/${containerName}/stop`
    })
  }

  startContainer(containerName) {
    return this.request({
      method: 'POST',
      path: `/containers/${containerName}/start`
    })
  }

  removeContainer(containerName) {
    return this.request({
      method: 'DELETE',
      path: `/containers/${containerName}`
    })
  }

  containerStats(containerName) {
    return this.request({
      method: 'GET',
      path: `/containers/${containerName}/stats`
    })
  }


  /**********
   * IMAGES *
   **********/

  removeImage(imageName) {
    return this.request({
      method: 'DELETE',
      path: `/images/${imageName}`
    })
  }

  pullImage(imageName, onDataChunkCallback) {
    var stream = this.stream({
      method: 'POST',
      path: `/images/create?fromImage=${imageName}&tag=latest`
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

}

module.exports = DockerApiClient
