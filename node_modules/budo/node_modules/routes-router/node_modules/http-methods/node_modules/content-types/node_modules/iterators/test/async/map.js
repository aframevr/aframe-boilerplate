var test = require("testling")
    , sinon = require("sinon")
    , map = require("../..").map
    , createItem = require("..").createItem

test("filter calls each iterator", function (t) {
    var item = createItem()
        , spy = sinon.spy()
        , iterator = function (value, callback) {
            spy.apply(this, arguments)
            callback(null, value + value)
        }
        , done = sinon.spy()

    map(item, iterator, done)

    t.ok(spy.calledThrice, "iterator is not called three times")
    t.ok(spy.getCall(0).calledWith("a1", sinon.match.func),
        "iterator called with wrong arguments")
    t.ok(spy.getCall(1).calledWith("b1", sinon.match.func),
        "iterator called with wrong arguments")
    t.ok(spy.getCall(2).calledWith("c1", sinon.match.func),
        "iterator called with wrong argument")
    t.ok(done.calledOnce, "done was not called")
    t.deepEqual(done.args[0], [null, {
        a: "a1a1"
        , b: "b1b1"
        , c: "c1c1"
    }], "done not called correctly")

    t.end()
})

test("map calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}
        , done = sinon.spy()

    map(item, iterator, thisValue, done)

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})

test("calls iterator with the callback last", function (t) {
    var item = createItem()
        , spy = sinon.spy()
        , iterator = function (value, index, list, callback) {
            spy.apply(this, arguments)
            callback()
        }
        , done = sinon.spy()

    map(item, iterator, done)

    t.ok(spy.calledThrice, "iterator was not called thrice")

    t.end()
})

test("filter returns an array when called on array", function (t) {
    var array = [1, 2, 3]
        , spy = sinon.spy()
        , iterator = function (v, callback) {
            spy.apply(this, arguments)
            callback(null, v * v)
        }
        , done = sinon.spy()


    map(array, iterator, done)

    t.ok(done.calledOnce, "done was not called")
    t.ok(Array.isArray(done.args[0]), "result is not an array")
    t.deepEqual(done.args[0], [null, [1, 4, 9]], "result is incorrect")

    t.end()
})

test("returns error appropiately", function (t) {
    var item = createItem()
        , errorValue = {}
        , iterator = function(callback) {
            callback(errorValue)
        }
        , done = sinon.spy()

    map(item, iterator, done)

    t.equal(done.args[0][0], errorValue, "this value is incorrect")

    t.end()
})