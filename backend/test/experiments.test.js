var chai = require('chai')
var expect = chai.expect
var fs = require('fs')
var path = require('path')

xdescribe('Experiments', function () {
  it('splits strings by comma', function () {
    var testString = "test1 ,  ,,    test2"
    var result = testString.split(/[\s,]+/)
    expect(result).to.deep.equal(['test1', 'test2'])
  })

  it('lists files recursively', function () {
    const walkSync = (dir, filelist = []) => {
      fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
          ? walkSync(path.join(dir, file), filelist)
          : filelist.concat(path.join(dir, file))
      })
      return filelist
    }

    var files = walkSync(__dirname)
    console.log(files)
  })

  it('path variable extraction', function () {
    var regex = new RegExp('/api/([a-zA-Z.-]*)/*(.*)', 'i')

    var match = regex.exec('/api/some-path-var/sub/path/with/api/some-system/containing?param=value')
    expect(match[1]).to.equal('some-path-var')
    expect(match[2]).to.equal('sub/path/with/api/some-system/containing?param=value')

    match = regex.exec('/api/mongoclient')
    expect(match[1]).to.equal('mongoclient')
    expect(match[2]).to.equal('')
  })

  it('function argument extraction', function () {
    var regex = /([function|constructor]\s*)?.*?\(([^)]*)\)/
    var testFunction = function (a, b, c) {
    }
    var matches1 = testFunction.toString().match(regex)
    expect(matches1[2]).to.equal('a, b, c')

    var testArrowFunction = (a, b, c) => {

    }
    var matches2 = testArrowFunction.toString().match(regex)
    expect(matches2[2]).to.equal('a, b, c')

    class testClass {
      constructor (a, b, c) { // eslint-disable-line no-useless-constructor

      }
    }
    var matches3 = testClass.toString().match(regex)
    expect(matches3[2]).to.equal('a, b, c')
  })

  it('Using a Promise with async/await that resolves successfully', function (done) {
    var testPromise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve('works')
      }, 200)
    })

    var asyncFunction = async function () {
      var result = await testPromise
      expect(result).to.equal('works')
      done()
    }

    asyncFunction()
  })

  it('Using a normal function with await works normally', function (done) {
    var testFunction = function () {
      return 'works'
    }

    var asyncFunction = async function () {
      var result = await testFunction()
      expect(result).to.equal('works')
      done()
    }

    asyncFunction()
  })

  describe('require cache', () => {
    
    before((done) => {
        require('./AppTestUtil').start().then(() => {
            done()
        })
    })

    it('examine', () => {
      console.log(Object.keys(require.cache).filter((element) => element.indexOf('dependencies') !== -1))
      expect(true).to.equal(true)
    })
  })
})
