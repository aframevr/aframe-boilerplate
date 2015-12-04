module.exports = every

function every(list, iterator, context) {
    var keys = Object.keys(list)
        , result

    if (arguments.length < 3) {
        context = this
    }

    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i]
            , value = list[key]
        
        result = iterator.call(context, value, key, list)

        if (result) {
            return result
        }
    }

    return result
}