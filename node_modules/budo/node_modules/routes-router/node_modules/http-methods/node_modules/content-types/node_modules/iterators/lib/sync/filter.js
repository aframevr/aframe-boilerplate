module.exports = filter

function filter(list, iterator, context) {
    var returnValue = Array.isArray(list) ? [] : {}
        , keys = Object.keys(list)

    if (arguments.length < 3) {
        context = this
    }

    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i]
            , value = list[key]
            , keepValue = iterator.call(context, value, key, list)

        if (keepValue) {
            if (Array.isArray(returnValue)) {
                returnValue.push(value)
            } else {
                returnValue[key] = value
            }
        }
    }

    return returnValue
}