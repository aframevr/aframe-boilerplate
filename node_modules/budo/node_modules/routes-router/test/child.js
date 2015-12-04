var test = require("tape")
var Router = require("../index.js")
var MockRequest = require("hammock/request")
var MockResponse = require("hammock/response")

test("child routers bubble not founds", function (assert) {
    var router = Router()
    var childRouter = Router()

    router.addRoute("/foo*?", childRouter)

    router(
        new MockRequest({ url: "/foo/bar" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 404)
            assert.equal(resp.body, "404 Not Found")

            assert.end()
        }))
})

test("child routers bubble errors", function (assert) {
    var router = Router()
    var childRouter = Router()

    router.addRoute("/foo*?", childRouter)

    childRouter.addRoute("/bar", function (req, res, opts, cb) {
        cb(new Error("no u"))
    })

    router(
        new MockRequest({ url: "/foo/bar" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 500)
            assert.deepEqual(resp.body, JSON.stringify({
                "errors": [{
                    message: "no u",
                    attribute: "general"
                }]
            }))

            assert.end()
        }))
})
