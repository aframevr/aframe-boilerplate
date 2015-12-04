var test = require("testling")
    , sinon = require("sinon")
    , some = require("../../").someSync
    , createItem = require("..").createItem

test("some calls each iterator", function (t) {
    var item = createItem()
        , iterator = sinon.spy(function (v) {
            if (v === "b1") {
                return v
            }
        })

    var result = some(item, iterator)

    t.ok(iterator.calledTwice, "iterator is not called two times")
    t.deepEqual(iterator.args[0], ["a1", "a", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], ["b1", "b", item],
        "iterator called with wrong arguments")
    t.equal(result, "b1", "result is incorrect")

    t.end()
})

test("some returns false if all fail", function (t) {
    var item = createItem()
        , iterator = sinon.spy(function (v) {
            return null
        })

    var result = some(item, iterator)

    t.ok(iterator.calledThrice, "iterator was not called three times")
    t.equal(result, null, "result is not false")

    t.end()
})

test("some calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}

    some(item, iterator, thisValue)

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})