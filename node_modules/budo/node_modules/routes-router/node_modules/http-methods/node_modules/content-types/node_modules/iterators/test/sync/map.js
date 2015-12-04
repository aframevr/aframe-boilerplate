var test = require("testling")
    , sinon = require("sinon")
    , map = require("../..").mapSync
    , createItem = require("..").createItem

test("map calls iterator with each item", function (t) {
    var item = createItem()
        , iterator = sinon.stub().returnsArg(0)

    var result = map(item, iterator)

    t.ok(iterator.calledThrice, "iterator was not called thrice")
    t.deepEqual(iterator.args[0], ["a1", "a", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], ["b1", "b", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[2], ["c1", "c", item],
        "iterator called with wrong arguments")
    t.deepEqual(item, result, "result is not the same as item")
    t.notEqual(item, result, "item and result are the same object")

    t.end()
})

test("map calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}

    map(item, iterator, thisValue)

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})

test("map returns array when called on array", function (t) {
    var array = [1, 2, 3]
        , iterator = sinon.stub().returnsArg(0)

    var result = map(array, iterator)

    t.ok(Array.isArray(result), "result is not an array")
    t.deepEqual(result,  array, "result is incorrect")

    t.end()
})