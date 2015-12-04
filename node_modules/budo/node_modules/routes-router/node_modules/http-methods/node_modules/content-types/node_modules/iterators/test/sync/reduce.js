var test = require("testling")
    , sinon = require("sinon")
    , reduce = require("../..").reduceSync
    , createItem = require("..").createItem

test("reduce calls each iterator", function (t) {
    var item = createItem()
        , iterator = sinon.spy(function (acc, v) {
            acc.key += v
            return acc
        })

    var result = reduce(item, iterator, {
        key: ""
    })

    t.ok(iterator.calledThrice, "iterator was not called thrice")
    t.deepEqual(iterator.args[0], [{
        key: "a1b1c1"
    }, "a1", "a", item], "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], [{
        key: "a1b1c1"
    }, "b1", "b", item], "iterator called with wrong arguments")
    t.deepEqual(iterator.args[2], [{
        key: "a1b1c1"
    }, "c1", "c", item], "iterator called with wrong arguments")
    t.deepEqual(result, {
        key: "a1b1c1"
    })

    t.end()
})

test("reduce calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}

    reduce(item, iterator, thisValue, {})

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})

test("reduce reduces with first value if no initialValue", function (t) {
    var list = [1, 2]
        , iterator = sinon.spy(function (sum, v) {
            return sum + v
        })

    var result = reduce(list, iterator)

    t.equal(result, 3, "result is incorrect")

    t.end()
})