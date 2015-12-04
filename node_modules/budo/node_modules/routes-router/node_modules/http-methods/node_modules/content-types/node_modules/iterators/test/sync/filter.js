var test = require("testling")
    , sinon = require("sinon")
    , filter = require("../..").filterSync
    , createItem = require("..").createItem

test("filter calls each iterator", function (t) {
    var item = createItem()
        , iterator = sinon.spy(function (v) {
            return v === "b1"
        })

    var result = filter(item, iterator)

    t.ok(iterator.calledThrice, "iterator is not called three times")
    t.deepEqual(iterator.args[0], ["a1", "a", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], ["b1", "b", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[2], ["c1", "c", item],
        "iterator called with wrong argument")
    t.deepEqual(result, { "b": "b1" }, "result is incorrect")
    t.notEqual(result, item, "result is incorrect")

    t.end()
})

test("filter calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}

    filter(item, iterator, thisValue)

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})

test("filter returns an array when called on array", function (t) {
    var array = [1, 2, 3]
        , iterator = sinon.spy(function (v) {
            return v === 2
        })

    var result = filter(array, iterator)

    t.ok(Array.isArray(result), "result is not an array")
    t.deepEqual(result, [2], "result is incorrect")

    t.end()
})