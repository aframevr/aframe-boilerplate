module.exports = map

function map(list, iterator, context) {
    var returnValue = Array.isArray(list) ? [] : {}
        , keys = Object.keys(list)

    if (arguments.length < 3) {
        context = this
    }

    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i]
            , value = list[key]
            , newValue = iterator.call(context, value, key, list)

        returnValue[key] = newValue
    }

    return returnValue
}