var test = require("testling")
    , sinon = require("sinon")
    , forEach = require("../..").forEachSync
    , createItem = require("..").createItem

test("forEach calls each iterator", function (t) {
    var item = createItem()
        , iterator = sinon.spy()

    forEach(item, iterator)

    t.ok(iterator.calledThrice, "iterator is not called three times")
    t.deepEqual(iterator.args[0], ["a1", "a", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], ["b1", "b", item],
        "iterator called with wrong arguments")
    t.deepEqual(iterator.args[2], ["c1", "c", item],
        "iterator called with wrong argument")

    t.end()
})

test("forEach calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}

    forEach(item, iterator, thisValue)

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})