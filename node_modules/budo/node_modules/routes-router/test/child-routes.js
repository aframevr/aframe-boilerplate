var test = require("tape")
var http = require("http")
var request = require("request")
var Router = require("../index.js")

var server
var PORT = 10000 + Math.floor(Math.random() * 20000)
var uri = "http://localhost:" + PORT

test("setup a server", function (assert) {
    var app = Router({
        errorHandler: function (req, res) {
            res.statusCode = 500
            res.end("no u")
        },
        notFound: function (req, res) {
            res.statusCode = 404
            res.end("oh noes")
        }
    })

    var users = Router()
    var posts = Router()

    app.addRoute("/user*?", users)
    app.addRoute("/post*?", posts)

    users.addRoute("/", function (req, res) {
        res.end("all users")
    })
    users.addRoute("/:id", function (req, res, opts) {
        res.end("user " + opts.params.id)
    })

    posts.addRoute("/", function (req, res) {
        res.end("all posts")
    })
    posts.addRoute("/:id", function (req, res, opts, cb) {
        if (opts.params.id === "0") {
            cb(new Error("lulz"))
        }

        res.end("post " + opts.params.id)
    })

    server = http.createServer(app)
    server.listen(PORT, function () {
        assert.end()
    })
})

test("GET /user", function (assert) {
    request.get(uri + "/user/", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body, "all users")
        assert.end()
    })
})

test("GET /user/:id", function (assert) {
    request.get(uri + "/user/4", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body, "user 4")
        assert.end()
    })
})

test("GET /post", function (assert) {
    request.get(uri + "/post/", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body, "all posts")
        assert.end()
    })
})

test("GET /post/:id", function (assert) {
    request.get(uri + "/post/4", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp && resp.body, "post 4")
        assert.end()
    })
})

test("GET 404", function (assert) {
    request.get(uri + "/", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp.statusCode, 404)
        assert.equal(resp && resp.body, "oh noes")
        assert.end()
    })
})

test("GET 500", function (assert) {
    request.get(uri + "/post/0", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp.statusCode, 500)
        assert.equal(resp && resp.body, "no u")
        assert.end()
    })
})

test("shutdown a server", function (assert) {
    server.close()
    assert.end()
})
