// Works with greenlock-express out-of-the-box
var proxy = require('http-proxy-middleware')
const DEFAULT_PORT = 3000

Provider('ApiProxyRoutes', (BackendRoutingService) => {

  return proxy('/apps/**', {
  
      // Default target
      target: 'http://nirvana:3000',


      // Overwrites `target`
      router: function (req) {

        var backendConfig = BackendRoutingService.getConfigForBackendUrl(req.url, '/apps')

        if (!backendConfig) {
          console.warn(`No backend config found for ${req.url}`)
          return null
        }

        var host = backendConfig.host
        var port = backendConfig.port || DEFAULT_PORT

        var backendUrl = `http://${host}:${port}`

        console.log(
          'Forward request',
          {
            originalUrl: req.originalUrl,
            headers: req.headers,
            body: req.body
          },
          `to ${backendUrl}`)

        return backendUrl
      },
  
      // Remove base path
      pathRewrite: {
        '^/apps/[a-zA-Z0-9.-]*/': ''
      },

      changeOrigin: true,
  
      ws: true,
  
      onError: function (err, req, res) {
        console.error('An error occurred while proxying request;')
        // console.error('request:', req)
        // console.error('error:', err)
  
        res.writeHead(502, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
          'message': 'Bad Gateway'
        }))
      }
  
  })

})