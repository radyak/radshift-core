var equalsIgnoreCase = function (envVarName, value) {
  var envVar = process.env[envVarName]
  if (envVar === undefined) {
    return false
  }
  return envVar.trim().toLowerCase() === value
}

var isTest = function () {
  return equalsIgnoreCase('ENV', 'test')
}
var isDev = function () {
  return equalsIgnoreCase('ENV', 'dev')
}
var isProd = function () {
  return (!isTest() && !isDev())
}

var Env = {
  isTest: isTest,
  isDev: isDev,
  isProd: isProd
}

var protectedKeys = Object.keys(Env)

var EnvProxy = new Proxy(Env, {
  get (target, name, receiver) {
    if (protectedKeys.indexOf(name) !== null) {
      return Env[name]
    }
    return process.env[name]
  }
})

module.exports = EnvProxy
