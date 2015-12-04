var StringDecoder = require("string_decoder").StringDecoder
    , querystring = require("querystring")
    , contentTypes = require("content-types")

body.form = formBody
body.json = jsonBody
body.any = anyBody

module.exports = body

function body(req, res, callback) {
    if (req.__body__) {
        callback(req.__body__)
    }

    var requestBody = "",
        stringDecoder = new StringDecoder

    req.on("data", addToBody)

    req.on("end", returnBody)

    function addToBody(buffer) {
        requestBody += stringDecoder.write(buffer)
    }

    function returnBody() {
        req.__body__ = requestBody
        callback(null, requestBody)
    }
}

function anyBody(req, res, callback) {
    contentTypes(req, res, {
        "application/json": jsonBody,
        "application/x-www-form-urlencoded": formBody,
        "default": body
    })(req, res, callback)
}

function formBody(req, res, callback)  {
    body(req, res, parseBody)

    function parseBody(err, body) {
        callback(null, querystring.parse(body))
    }
}

function jsonBody(req, res, callback) {
    body(req, res, extractJSON)

    function extractJSON(err, body) {
        var json
        try {
            json = JSON.parse(body)
        } catch (error) {
            return callback(error)
        }
        callback(null, json)
    }
}