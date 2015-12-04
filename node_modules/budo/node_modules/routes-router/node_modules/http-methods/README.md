# http-methods [![build status][1]][2]

Handle multiple methods elegantly

## Example

    var methods = require("http-methods")
        , http = require("http")

    http.createServer(methods({
        GET: function (req, res)  { res.end("get") }
        , POST: function (req, res) { res.end("post") }
    })).listen(8080)

## Installation

`npm install http-methods`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/http-methods.png
  [2]: http://travis-ci.org/Raynos/http-methods