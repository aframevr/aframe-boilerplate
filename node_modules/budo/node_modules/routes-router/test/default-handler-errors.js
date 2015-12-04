var test = require("tape")
var MockRequest = require("hammock/request")
var MockResponse = require("hammock/response")

var Router = require("../index.js");

test("errors default to 500", function (assert) {
    var router = Router()

    router.addRoute("*", function (req, res, opts, cb) {
        cb(new Error("some error"))
    })

    router(
        MockRequest({ url: "/foo" }),
        MockResponse(function (err, resp) {
            assert.ifError(err)

            assert.equal(resp.statusCode, 500)
            var body = JSON.parse(resp.body)

            assert.deepEqual(body, {
                errors: [
                    { message: "some error", attribute: "general" }
                ]
            })

            assert.end()
        }))
})
