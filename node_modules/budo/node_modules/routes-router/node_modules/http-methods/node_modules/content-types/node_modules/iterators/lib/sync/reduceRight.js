module.exports = reduceRight

function reduceRight(list, iterator, context, accumulator) {
    var keys = Object.keys(list)
        , len = keys.length
        , i = len - 1

    if (arguments.length === 2) {
        context = this
        accumulator = list[i]
        i--
    } else if (arguments.length === 3) {
        accumulator = context
        context = this
    }

    for (; i >= 0; i--) {
        var key = keys[i]
            , value = list[key]

        accumulator = iterator.call(context, accumulator, value, key, list)
    }

    return accumulator
}