# body [![build status][1]][2]

Body parsing

## Example

```
var body = require("body")
    , jsonBody = body.json
    , formBody = body.form
    , anyBody = body.any
    , http = require("http")
    , sendJson = require("send-data").json

http.createServer(function handleRequest(req, res) {
    if (req.url === "/body") {
        body(req, res, function (err, body) {
            sendJson(req, res, body)
        })
    } else if (req.url === "/form") {
        formBody(req, res, function (err, body) {
            sendJson(req, res, body)
        })
    } else if (req.url === "/json") {
        jsonBody(req, res, function (err, body) {
            sendJson(req, res, body)
        })
    } else if (req.url === "/any") {
        anyBody(req, res, function (err, body) {
            sendJson(req, res, body)
        })
    }
})
```

`body` simply parses the request body and returns it in the callback. `jsonBody` and `formBody` call JSON.parse and querystring.parse respectively on the body.

anyBody will detect the content-type of the request and use the appropiate body method.

## Installation

`npm install body`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/body.png
  [2]: http://travis-ci.org/Raynos/body