# content-types [![build status][1]][2]

handle multiple content types

## Example

    var http = create("http")
        , contentTypes = require("routil-contentTypes")

    http.createServer(function () {
        contentTypes(req, {
            "text/html": returnHtml
            , "application/javascript": returnJson
        })(req, res)
    }).listen(8080)

    function returnHtml(req, res) {
        res.end("<ul><li>foo</li><li>bar</li></ul>")
    }

    function returnJson(req, res) {
        res.end(JSON.stringify(["foo", "bar"]))
    }

## Installation

`npm install content-types`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/content-types.png
  [2]: http://travis-ci.org/Raynos/content-types