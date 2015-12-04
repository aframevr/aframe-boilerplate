var test = require("tape")

var Router = require("../index")

test("duplicate addRoute() throws exception", function (assert) {
    var router = Router()

    router.addRoute("/foo/:id/*", function () {})

    assert.throws(function () {
        router.addRoute("/foo/:id/*", function () {})
    }, /route already exists/)

    assert.end()
})
