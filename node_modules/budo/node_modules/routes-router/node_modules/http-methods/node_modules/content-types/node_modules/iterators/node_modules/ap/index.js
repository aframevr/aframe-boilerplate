exports = module.exports = ap;
function ap (args, fn) {
    return function () {
        return fn.apply(this, args.concat.apply(args, arguments));
    };
}

exports.pa = pa;
function pa (args, fn) {
    return function () {
        return fn.apply(this, [].slice.call(arguments).concat(args));
    };
}

exports.apa = apa;
function apa (left, right, fn) {
    return function () {
        return fn.apply(this,
            left.concat.apply(left, arguments).concat(right)
        );
    };
}

exports.partial = partial;
function partial (fn) {
    var args = [].slice.call(arguments, 1);
    return ap(args, fn);
}

exports.partialRight = partialRight;
function partialRight (fn) {
    var args = [].slice.call(arguments, 1);
    return pa(args, fn);
}

exports.curry = curry;
function curry (fn) {
    return partial(partial, fn);
}

exports.curryRight = function curryRight (fn) {
    return partial(partialRight, fn);
}
