var TypeUtil = require('./TypeUtil')

var traverse = function (val, fn, key, owner) {
  if (TypeUtil.isArray(val)) {
    traverseArray(val, fn)
  } else if (TypeUtil.isObject(val)) {
    traverseObject(val, fn)
  } else {
    fn(key, val, owner)
  }
}

var traverseArray = function (arr, fn) {
  arr.forEach(function (currentValue, index, array) {
    traverse(currentValue, fn, index, array)
  })
}

var traverseObject = function (obj, fn) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      traverse(obj[key], fn, key, obj)
    }
  }
}

var deepCopy = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

var ObjectUtil = {
  traverse: traverse,
  deepCopy: deepCopy
}

module.exports = ObjectUtil
