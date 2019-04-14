var expect = require('chai').expect
var FileUtil = require('../../src/util/FileUtil')

describe('FileUtil', function () {
  it('lists files recursively', function () {
    var files = FileUtil.listFilesRecursively('test/res/fileUtil')
    console.log(files)
    expect(files.length).to.equal(4)
  })
})
