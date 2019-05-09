// Works with greenlock-express out-of-the-box
var proxy = require('http-proxy-middleware')
const DEFAULT_PORT = 3000

Configuration('ApiProxyRoutes', (BackendConfigurationService) => {

  const getConfigForBackendUrl = (url) => {
    var regex = new RegExp('/api/([a-zA-Z0-9.-]*)/*(.*)', 'i')
    var matches = regex.exec(url)

    var backendName = matches[1]

    var backendConfig = BackendConfigurationService.getBackendConfiguration(backendName)

    return {
      ...backendConfig
    }
  }

  return proxy('/api/**', {
  
      // Default target
      target: 'http://nirvana:3000',


      // Overwrites `target`
      router: function (req) {
        var backendConfig = getConfigForBackendUrl(req.url)

        if (!backendConfig) {
          return null
        }

        var host = backendConfig.host || backendName
        var port = backendConfig.port || DEFAULT_PORT

        var backendUrl = `http://${host}:${port}`
        return backendUrl
      },
  
      // Remove base path
      pathRewrite: {
        '^/api/[a-zA-Z0-9.-]*/': ''
      },

      changeOrigin: true,
  
      ws: true,
  
      onError: function (err, req, res) {
        console.error('An error occurred while proxying request; request:', req, 'error:', err)
  
        res.writeHead(502, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
          'message': 'Bad Gateway'
        }))
      }
  
  })

})