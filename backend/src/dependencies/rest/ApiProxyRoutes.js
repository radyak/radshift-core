// Works with greenlock-express out-of-the-box
// TODO: check if proxy requires bodyParser.raw()
var proxy = require('http-proxy-middleware')
const DEFAULT_PORT = 3000

Configuration('ApiProxyRoutes', (BackendConfigurationService) => {

    return proxy('/api/**', {

        // Overwrites `target`
        router: function (message) {
          var regex = new RegExp('/api/([a-zA-Z0-9.-]*)/*(.*)', 'i')
          var matches = regex.exec(message.url)

          console.log('matches=', matches)
          
          var backendName = matches[1]

          var backendConfig = BackendConfigurationService.getBackendConfiguration(backendName)

          if (!backendConfig) {
            return null
          }

          var host = backendConfig.host || backendName
          var port = backendConfig.port || DEFAULT_PORT

          var backendUrl = `http://${host}:${port}`
          return backendUrl
        },
    
        // Default target
        target: 'http://nirvana:3000',
    
        changeOrigin: true,
    
        ws: true,
    
        // Remove base path
        pathRewrite: {
          '^/api/[a-zA-Z0-9.-]*/': ''
        },
    
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