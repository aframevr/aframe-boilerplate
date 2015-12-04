var test = require("tape")
var MockRequest = require("hammock/request")
var MockResponse = require("hammock/response")

var DomainRouter = require("../domain")

test("use domains", function (assert) {
    var router = DomainRouter()

    router.addRoute("/hello", function (req, res) {
        res.end("world")
    })

    router(
        new MockRequest({ url: "/hello" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.body, "world")

            assert.end()
        }))
})

test("throw an exception async in handler", function (assert) {
    var router = DomainRouter({ teardown: noop })

    router.addRoute("/throw", function () {
        process.nextTick(function () {
            throw new Error("lulz no")
        })
    })

    router(
        new MockRequest({ url: "/throw" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 500)
            assert.equal(resp.body, JSON.stringify({
                errors: [{
                    message: "lulz no",
                    handlingError: null,
                    attribute: "general"
                }]
            }))

            assert.end()
        }))
})

test("throw an exception in handler", function (assert) {
    process.nextTick(function () {
        var router = DomainRouter({ teardown: noop })

        router.addRoute("/throw", function () {
            throw new Error("lulz no")
        })

        router(
            new MockRequest({ url: "/throw" }),
            MockResponse(function (err, resp) {
                assert.ifError(err)

                assert.equal(resp.statusCode, 500)
                assert.equal(resp.body, JSON.stringify({
                    errors: [{
                        message: "lulz no",
                        handlingError: null,
                        attribute: "general"
                    }]
                }))

                assert.end()
            }))
    })
})

test("add a teardown handler", function (assert) {
    process.nextTick(function () {
        var called = 0
        var router = DomainRouter({
            teardown: function (err) {
                assert.ok(err)
                assert.equal(called, 1)
                assert.equal(err.message, "oh hi")

                assert.end()
            }
        })

        router.addRoute("/", function () {
            throw new Error("oh hi")
        })

        router(
            new MockRequest({ url: "/" }),
            MockResponse(function (err, resp) {
                assert.ifError(err)

                called++
                assert.equal(resp.statusCode, 500)
            }))
    })
})

test("emitting error on req", function (assert) {
    var router = DomainRouter({ teardown: noop })

    router.addRoute("/throw", function (req) {
        req.emit("error", new Error("lulz no"))
    })

    router(
        new MockRequest({ url: "/throw" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 500)
            assert.equal(resp.body, JSON.stringify({
                errors: [{
                    message: "lulz no",
                    handlingError: null,
                    attribute: "general"
                }]
            }))

            assert.end()
        }))
})

test("emitting error on res", function (assert) {
    var router = DomainRouter({ teardown: noop })

    router.addRoute("/throw", function (req, res) {
        res.emit("error", new Error("lulz no"))
    })

    var res = MockResponse()

    res.on("response", function (err, resp) {
        assert.ifError(err)

        assert.equal(resp.statusCode, 500)
        assert.equal(resp.body, JSON.stringify({
            errors: [{
                message: "lulz no",
                handlingError: null,
                attribute: "general"
            }]
        }))

        assert.end()
    })

    router(new MockRequest({ url: "/throw" }), res)
})

test("throwing an exception in the domain error handler", function (assert) {
    process.nextTick(function () {
        var errorHandler = false
        var response = false
        var router = DomainRouter({
            teardown: function (err) {
                assert.ok(err)

                assert.equal(errorHandler, true)
                assert.equal(response, true)

                assert.equal(err.message, "re-emit error")
                assert.ok(err.handlingError);
                assert.equal(err.handlingError.message,
                    "different error")

                assert.end()
            }
        })

        router.addRoute("/", function () {
            throw new Error("re-emit error")
        })

        router(
            new MockRequest({ url: "/" }),
            MockResponse(function (err, resp) {
                assert.ifError(err)

                response = true

                assert.equal(resp.body, "")
            }),
            function (err) {
                assert.ok(err)

                errorHandler = true

                assert.equal(err.message, "re-emit error")

                throw new Error("different error")
            })
    })
})

test("goes to uncaught by default", function (assert) {
    process.nextTick(function () {
        var router = DomainRouter()
        var called = false

        var listeners = process._events.uncaughtException
        process._events.uncaughtException = null

        process.on("uncaughtException", oncaught)

        router.addRoute("/throw", function () {
            throw new Error("lulz no")
        })

        router(
            new MockRequest({ url: "/throw" }),
            MockResponse(function (err, resp) {
                assert.ifError(err)

                called = true

                assert.equal(resp.statusCode, 500)
                assert.equal(resp.body, JSON.stringify({
                    errors: [{
                        message: "lulz no",
                        handlingError: null,
                        attribute: "general"
                    }]
                }))
            }))

        function oncaught(err) {
            assert.equal(called, true)

            assert.equal(err.message, "lulz no")

            process._events.uncaughtException = listeners

            assert.end()
        }

    })
})

function noop() {}
