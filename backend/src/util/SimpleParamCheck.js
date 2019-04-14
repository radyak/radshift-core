var SimpleParamCheck = {
  checkForFalsy: function (object) {
    var invalidFields = []
    for (var key in object) {
      var value = object[key]
      if (!value) {
        invalidFields.push(key)
      }
    }
    if (invalidFields.length > 0) {
      var invalidFieldsString = invalidFields.join(', ')
      throw new Error(
        `The following properties are invalid (falsy): ${invalidFieldsString}`
      )
    }
  }
}

module.exports = SimpleParamCheck
