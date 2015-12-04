var Router = require("../index.js")
var http = require("http")
var process = require("process")
var test = require("tape")
var request = require("request")

var server
var PORT = 10000 + Math.floor(Math.random() * 20000)
var uri = "http://localhost:" + PORT

test("setup a server", function (assert) {
    var router = Router()
    var db = {
        get: function (key, cb) {
            process.nextTick(cb.bind(null, null, key))
        }
    }

    router.addRoute("/foo", function (req, res) {
        res.end("hello!")
    })

    router.addRoute("/bars/:barName", function (req, res, opts) {
        res.end("you request bars " + opts.params.barName)
    })

    router.addRoute("/foos/:fooName", function (req, res, opts, cb) {
        db.get(opts.params.fooName, function (err, value) {
            if (err) {
                return cb(err)
            }

            res.end(JSON.stringify(value))
        })
    })

    router.addRoute("/baz/:things", {
        GET: function (req, res) {
            res.end("I will give you your thing")
        },
        POST: function (req, res) {
            res.end("got your things")
        }
    })

    server = http.createServer(router)
    server.listen(PORT, function () {
        assert.end()
    })
})

test("hitting a route", function (assert) {
    request({
        uri: uri + "/foo",
        method: "GET"
    }, function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body, "hello!")
        assert.end()
    })
})

test("hitting a /bars route", function (assert) {
    request(uri + "/bars/baz",  function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body, "you request bars baz")
        assert.end()
    })
})

test("hitting a /foos route",  function (assert) {
    request(uri + "/foos/foo2", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body, "\"foo2\"")
        assert.end()
    })
})

test("hitting a /baz route", function (assert) {
    request.get(uri + "/baz/bar", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body,
            "I will give you your thing")
        assert.end()
    })
})

test("POST to a /baz route", function (assert) {
    request.post(uri + "/baz/bar", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body,
            "got your things")
        assert.end()
    })
})

test("shutdown a server", function (assert) {
    server.close()
    assert.end()
})
