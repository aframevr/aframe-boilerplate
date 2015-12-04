var partial = require("ap").partial

module.exports = filter

function filter(list, iterator, context, callback) {
    var keys = Object.keys(list)
        , returnValue = Array.isArray(list) ? [] : {}
        , count = keys.length

    if (typeof context === "function") {
        callback = context
        context = this
    }

    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i]
            , value = list[key]
        
        invokeIterator(iterator,
            partial(next, value, key), context, value, key, list)
    }

    function next(value, key, err, keepValue) {
        if (err) {
            return callback && callback(err)
        }

        if (keepValue) {
            if (Array.isArray(returnValue)) {
                returnValue.push(value)
            } else {
                returnValue[key] = value
            }
        }

        if (--count === 0) {
            callback && callback(null, returnValue)
        }
    }
}

function invokeIterator(iterator, done, context, value, key, list) {
    var length = iterator.length

    if (length === 1) {
        iterator.call(context, done)
    } else if (length === 2) {
        iterator.call(context, value, done)
    } else if (length === 3) {
        iterator.call(context, value, key, done)
    } else {
        iterator.call(context, value, key, list, done)
    }
}