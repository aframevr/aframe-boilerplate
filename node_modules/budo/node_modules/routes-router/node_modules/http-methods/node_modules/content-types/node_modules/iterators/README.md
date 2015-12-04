# Iterators [![build status][1]][2]

Iterate over collections in sync or async

## Example

    var iterators = require("iterators")
        , map = iterators.map
        , fs = require("fs")
        , readFile = fs.readFile

    map({
        "foo": "test/foo.js"
        , "bar": "test/bar.js"
    }, readFile, function (err, files) {
        // files.foo, files.bar
    })

## Motivation

There are a few minor issues with the iterators on Array.prototype and alternatives provided by underscore / async.

This library fixes the following nitpicks:

 - You can call an iterator on both an array and an object
 - every / some return the truthy / falsey value without coercing to a boolean
 - reduce / reduceRight accept a optional thisValue
 - provides asynchronous implementations of all iterators that use a 
    callback<Error, Value> instead of returning the value

## Installation

`npm install composite`

## Tests

`make test`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/iterators.png
  [2]: http://travis-ci.org/Raynos/iterators 
  [3]: https://github.com/Raynos/iterators/tree/master/test