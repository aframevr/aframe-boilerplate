var test = require("testling")
    , sinon = require("sinon")
    , every = require("../..").everySync
    , createItem = require("..").createItem

test("every calls each iterator", function (t) {
    var item = createItem()
        , iterator = sinon.spy(function (v) {
            return v
        })

    var result = every(item, iterator)

    t.ok(iterator.calledThrice, "iterator is not called three times")
    t.deepEqual(iterator.args[0], ["a1", "a", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], ["b1", "b", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[2], ["c1", "c", item],
        "iterator called with wrong argument")
    t.equal(result, "c1", "result is incorrect")

    t.end()
})

test("every fails if false", function (t) {
    var item = createItem()
        , iterator = sinon.spy(function (v) {
            return null
        })

    var result = every(item, iterator)

    t.ok(iterator.calledOnce, "iterator was not called once")
    t.equal(result, null, "result is not false")

    t.end()
})

test("every calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}

    every(item, iterator, thisValue)

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})