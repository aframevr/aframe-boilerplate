var test = require("tape")
var Router = require("../index.js")
var MockRequest = require("hammock/request")
var MockResponse = require("hammock/response")

function createRouters() {
    var child = Router()
    child.addRoute("/", function (req, res) {
        res.end(req.url)
    })
    child.addRoute("/bar", function (req, res) {
        res.end(req.url)
    })
    child.addRoute("/:id", function (req, res, opts) {
        res.end(req.url + ", " + opts.params.id)
    })

    var parent = Router()

    parent.prefix("/foo", child)

    return parent
}

test("can add prefix router", function (assert) {
    var router = createRouters()

    router(
        MockRequest({ url: "/foo/" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "/foo/")

            assert.end()
        })
    )
})

test("prefix shows about no route", function (assert) {
    var router = Router()
    var errorRegex = /router\.prefix\(\"\/some\-prefix\", fn\)/

    assert.throws(function () {
        router.prefix()
    }, errorRegex)

    assert.end()
})

test("prefix complains about trailing slash", function (assert) {
    var router = Router()
    var errorRegex = /Passing a trailing slash does not work/

    assert.throws(function () {
        router.prefix("/trailingSlash/")
    }, errorRegex)
    
    assert.end()
})

test("prefix complains about lack of leading slash", function (assert) {
    var router = Router()
    var errorRegex = /Must start "some-prefix" with a leading slash/

    assert.throws(function () {
        router.prefix("leadingSlashMissing")
    }, errorRegex)

    assert.end()
})

test("prefix supports object format", function (assert) {
    var router = Router()
    router.prefix("/foo", {
        POST: function (req, res) {
            res.end("oh hi")
        }
    })

    router(
        MockRequest({ method: "POST", url: "/foo" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "oh hi")

            router(
                MockRequest({ url: "/foo" }),
                MockResponse(function (err, resp) {
                    assert.ifError(err)

                    assert.equal(resp.statusCode, 405)
                    assert.equal(resp.body,
                        "405 Method Not Allowed /foo")

                    assert.end()
                }))
        }))
})

test("prefix supports nested uris", function (assert) {
    var router = createRouters()

    router(
        MockRequest({ url: "/foo/bar" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "/foo/bar")

            assert.end()
        })
    )
})

test("prefix supports root uris", function (assert) {
    var router = createRouters()

    router(
        MockRequest({ url: "/foo" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "/foo")

            assert.end()
        })
    )
})

test("supports :id in nested router", function (assert) {
    var router = createRouters()

    router(
        MockRequest({ url: "/foo/baz" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "/foo/baz, baz")

            assert.end()
        })
    )
})

test("child not found handler", function (assert) {
    var child = Router()
    child.addRoute("*", function (req, resp) {
        resp.statusCode = 404
        resp.end("custom not found")
    })

    var parent = Router()
    parent.prefix("/foo", child)

    parent(
        MockRequest({ url: "/foo" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 404)
            assert.equal(resp.body, "custom not found")

            parent(
                MockRequest({ url: "/foo/" }),
                MockResponse(function (err, resp) {
                    assert.ifError(err)

                    assert.equal(resp.statusCode, 404)
                    assert.equal(resp.body, "custom not found")

                    assert.end()
                }))
        }))
})

test("child should not be greedy", function (assert) {
    var child = Router()
    child.addRoute("*", function (req, resp) {
        resp.end("all the dogs")
    })

    var parent = Router()

    parent.prefix("/dog", child)
    parent.addRoute("/doge", function (req, resp) {
        resp.end("doge")
    })

    parent(
        MockRequest({ url: "/doge" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "doge")

            assert.end()
        }))
})

test("child inherits params", function (assert) {
    var child = Router()
    child.addRoute("/:five/*/eight", function (req, resp, opts) {
        resp.end("two: " + opts.params.two +
            " three: " + opts.splats[0] +
            " five: " + opts.params.five +
            " six: " + opts.splats[1])
    })

    var parent = Router()

    parent.prefix("/one/:two/*/four", child)

    var url = "/one/two/three/four/five/six/seven/eight"

    parent(
        MockRequest({ url: url }),
        MockResponse(function (err, resp) {
            assert.ifError(err);

            assert.equal(resp.body,
                "two: two three: three " +
                "five: five six: six/seven")

            assert.end()
        }))
})

test("can prefix at /", function (assert) {
    var child = Router()
    child.addRoute("/", function (req, resp) {
        resp.end("/")
    })
    child.addRoute("/foo", function (req, resp) {
        resp.end("/foo")
    })
    child.addRoute("/:id", function (req, resp) {
        resp.end("/:id")
    })

    var parent = Router()
    parent.prefix("/", child)

    request(parent, {
        url: "/"
    }, function (err, resp) {
        assert.ifError(err)

        assert.equal(resp.body, "/")

        request(parent, {
            url: "/foo"
        }, function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "/foo")

            request(parent, {
                url: "/bar"
            }, function (err, resp) {
                assert.ifError(err)

                assert.equal(resp.body, "/:id")

                assert.end()
            })

        })
    })
})

function request(handler, req, cb) {
    handler(
        MockRequest(req),
        MockResponse(cb));
}
