var test = require("tape");
var MockRequest = require("hammock/request");
var MockResponse = require("hammock/response");

var Router = require("../index")

test("routes-router is a function", function (assert) {
    assert.equal(typeof Router, "function")
    assert.end()
})

test("can create a router", function (assert) {
    var router = Router()

    router.addRoute("/foo", function (req, res) {
        res.end("bar")
    })

    router(
        new MockRequest({ url: "/foo" }),
        new MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "bar")

            assert.end()
        })
    )
})

test("passes not found errors to callback", function (assert) {
    var router = Router()

    router.addRoute("/", function (req, res) {
        res.end("hi")
    })

    var called = 0
    var res = new MockResponse(function (err, resp) {
        assert.ifError(err)

        assert.equal(resp.statusCode, 404)
        assert.equal(resp.body, "no u")
        assert.equal(called, 1)

        assert.end()
    })

    router(
        new MockRequest({ url: "/404" }), res,
        function (err) {
            called++
            assert.equal(err.notFound, true)
            assert.equal(err.statusCode, 404)
            assert.equal(err.url, "/404")

            res.statusCode = err.statusCode
            res.end("no u")
        }
    )
})

test("can call match() on router", function (assert) {
    var router = Router()

    function homeRoute(req, res) {
        res.end("Fuck you.")
    }

    router.addRoute("/", homeRoute)

    var match1 = router.match("/")
    var match2 = router.match("/foo")

    delete match1.next

    assert.deepEqual(match1, {
        params: {},
        splats: [],
        route: "/",
        fn: homeRoute,
    })
    assert.equal(match2, undefined)

    assert.end()
})

test("hit defaultNotFound", function (assert) {
    var router = Router()

    router(
        new MockRequest({ uri: "/" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 404)
            assert.equal(resp.body, "404 Not Found")

            assert.end()
        })
    )
})

test("hit defaultErrorHandler", function (assert) {
    var router = Router()

    router.addRoute("/", function (req, res, opts, cb) {
        cb(new Error("lulz"))
    })

    router(
        new MockRequest({ uri: "/" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 500)
            assert.equal(resp.body, JSON.stringify({
                errors: [{
                    message: "lulz",
                    attribute: "general"
                }]
            }))

            assert.end()
        })
    )
})

test("hit callback with no errors", function (assert) {
    var router = Router()

    router.addRoute("/", function (req, res, opts, cb) {
        res.end("oh hi")
        cb()
    })

    router(
        new MockRequest({ uri: "/" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "oh hi")

            assert.end()
        }))
})

test("can pass in options", function (assert) {
    var router = Router()

    router.addRoute("/lulz", function (req, res, opts) {
        assert.equal(opts.foo, "bar")
        res.end("winning " + opts.foo)
    })

    router(
        new MockRequest({ url: "/lulz" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "winning bar")
            assert.end()
        }),
        { foo: "bar" })
})

test("opts has parsedUrl", function (assert) {
    var router = Router()

    router.addRoute("/foo", function (req, res, opts) {
        res.end(opts.parsedUrl.query)
    })

    router(
        MockRequest({ url: "/foo?hello=there" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "hello=there")
            assert.end()
        }))
})

test("preHandleHook is called", function(assert) {
var router = Router();

    router.addRoute("/foo", function (req, res, opts) {
        res.end(opts.route.route);
    });

    var opts = {};
    opts.preHandleHook = function preHandleHook(params) {
        params.reqOpts.params.route = params.reqOpts.route;
    };
    router(
        MockRequest({ url: "/foo?hello=there" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)
            assert.equal(resp.body, "/foo")
            assert.end()
        }),
        opts);
})

test("can call removeRoute() on router", function (assert) {
    var router = Router()

    router.addRoute("/win", function (req, res) {
        res.end("winning")
    })

    router.addRoute("/lose", function (req, res) {
        res.end("losing")
    })

    router.removeRoute("/lose");

    router(
        new MockRequest({ url: "/win" }),
        new MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "winning")
        })
    )

    router(
        new MockRequest({ uri: "/lose" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 404)
            assert.equal(resp.body, "404 Not Found")

            assert.end()
        })
    )
})
