var test = require("testling")
    , sinon = require("sinon")
    , reduceRight = require("../..").reduceRightSync
    , createItem = require("..").createItem

test("reduce calls each iterator", function (t) {
    var item = createItem()
        , iterator = sinon.spy(function (acc, v) {
            acc.key += v
            return acc
        })

    var result = reduceRight(item, iterator, {
        key: ""
    })

    t.ok(iterator.calledThrice, "iterator was not called thrice")
    t.deepEqual(iterator.args[0], [{
        key: "c1b1a1"
    }, "c1", "c", item], "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], [{
        key: "c1b1a1"
    }, "b1", "b", item], "iterator called with wrong arguments")
    t.deepEqual(iterator.args[2], [{
        key: "c1b1a1"
    }, "a1", "a", item], "iterator called with wrong arguments")
    t.deepEqual(result, {
        key: "c1b1a1"
    }, "result is incorrect")

    t.end()
})

test("reduce calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}

    reduceRight(item, iterator, thisValue, {})

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})

test("reduce reduces with first value if no initialValue", function (t) {
    var list = [1, 2]
        , iterator = sinon.spy(function (sum, v) {
            console.log("args", arguments)
            return sum + v
        })

    var result = reduceRight(list, iterator)

    t.equal(result, 3, "result is incorrect")

    t.end()
})