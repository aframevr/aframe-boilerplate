var test = require("testling")
    , sinon = require("sinon")
    , every = require("../..").every
    , createItem = require("..").createItem

test("some calls each iterator", function (t) {
    var item = createItem()
        , spy = sinon.spy()
        , iterator = function (value, callback) {
            spy.apply(this, arguments)
            callback(null, value)
        }
        , done = sinon.spy()

    every(item, iterator, done)

    t.ok(spy.calledThrice, "iterator is not called three times")
    t.ok(spy.getCall(0).calledWith("a1", sinon.match.func),
        "iterator called with wrong arguments")
    t.ok(spy.getCall(1).calledWith("b1", sinon.match.func),
        "iterator called with wrong arguments")
    t.ok(spy.getCall(2).calledWith("c1", sinon.match.func),
        "iterator called with wrong arguments")
    t.ok(done.calledOnce, "done was not called")
    t.deepEqual(done.args[0], [null, "c1"], "done not called correctly")

    t.end()
})

test("some calls iterator with correct this value", function (t) {
    var item = createItem()
        , iterator = sinon.spy()
        , thisValue = {}
        , done = sinon.spy()

    every(item, iterator, thisValue, done)

    t.ok(iterator.calledOn(thisValue), "this value is incorrect")

    t.end()
})

test("some returns false if all fail", function (t) {
    var item = createItem()
        , spy = sinon.spy()
        , iterator = function (v, callback) {
            spy.apply(this, arguments)
            callback(null, false)
        }
        , done = sinon.spy()

    every(item, iterator, done)

    t.ok(spy.calledThrice, "iterator was not called three times")
    t.deepEqual(done.args[0], [null, false], "result is not false")

    t.end()
})

test("some error appropiately", function (t) {
    var item = createItem()
        , errorValue = {}
        , iterator = function(callback) {
            callback(errorValue)
        }
        , done = sinon.spy()

    every(item, iterator, done)

    t.equal(done.args[0][0], errorValue, "this value is incorrect")

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

    every(item, iterator, done)

    t.ok(spy.calledThrice, "iterator was not called thrice")

    t.end()
})