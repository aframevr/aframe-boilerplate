var assert = require("assert")
var http = require('http')
var url = require('url')
var Routes = require('../index')
var router = new Routes()

router.addRoute('/*?', staticFiles)
router.addRoute('/admin/*?', auth)
router.addRoute('/admin/users', adminUsers)
router.addRoute('/*', notFound)

var server = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname
  var match = router.match(path)

  function wrapNext(next) {
    return function() {
      var match = next()
      match.fn(req, res, wrapNext(match.next))
    }
  }

  match.fn(req, res, wrapNext(match.next))

}).listen(1337, runTests)

// serve the file or pass it on
function staticFiles(req, res, next) {
  var qs = url.parse(req.url, true).query
  if (qs.img) {
    res.statusCode = 304
    res.end()
  }
  else {
    res.setHeader('x-static', 'next')
    next()
  }
}

// authenticate the user and pass them on
// or 403 them
function auth(req, res, next) {
  var qs = url.parse(req.url, true).query
  if (qs.user) {
    res.setHeader('x-auth', 'next')
    return next()
  }
  res.statusCode = 403
  res.end()
}

// render the admin.users page
function adminUsers(req, res, next) {
  res.statusCode = 200
  res.end()
}

function notFound(req, res, next) {
  res.statusCode = 404
  return res.end()
}


function httpError(err) {
  console.error('An error occurred:', err)
  tryClose()
}

function runTests() {

  http.get("http://localhost:1337/?img=1", function(res) {
    console.log('Match \\*? and return 304')
    assert.equal(res.statusCode, 304)
    assert.notEqual(res.headers['x-static'], 'next')
    tryClose()
  }).on('error', httpError)

  http.get("http://localhost:1337/admin/users", function(res) {
    console.log('Match \\admin\\* and return 403')
    assert.equal(res.statusCode, 403)
    assert.equal(res.headers['x-static'], 'next')
    tryClose()
  }).on('error', httpError)

  http.get("http://localhost:1337/admin/users?user=1", function(res) {
    console.log('Match \\admin\\users and return 200')
    assert.equal(res.statusCode, 200)
    assert.equal(res.headers['x-static'], 'next')
    assert.equal(res.headers['x-auth'], 'next')
    tryClose()
  }).on('error', httpError)

  http.get("http://localhost:1337/something-else", function(res) {
    console.log('Match \\*? but not an image and return 404')
    assert.equal(res.statusCode, 404)
    assert.equal(res.headers['x-static'], 'next')
    tryClose()
  }).on('error', httpError)

}

var waitingFor = 4
function tryClose() {
  waitingFor--
  if (!waitingFor) {
    process.exit()
  }
}