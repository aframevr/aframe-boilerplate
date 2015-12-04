module.exports = forEach

function forEach(list, iterator, context) {
    var keys = Object.keys(list)

    if (arguments.length < 3) {
        context = this
    }

    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i]
            , value = list[key]
        
        iterator.call(context, value, key, list)
    }
}