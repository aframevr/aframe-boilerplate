var testServer = require("test-server")
    , test = require("tap").test
    , ContentTypes = require("..")

testServer(handleRequest, runTests)

function handleRequest(req, res) {
    ContentTypes(req, res, {
        "application/json": json
        , "application/x-www-form-urlencoded": form
        , "default": normal
    })(req, res)
}

function json(req, res) {
    res.end("json")
}

function form(req, res) {
    res.end("form")
}

function normal(req, res) {
    res.end("normal")
}

function runTests(request, done) {
    test("test json path", function (t) {
        request({
            uri: "/"
            , headers: {
                "content-type": "application/json"
            }
        }, function (err, res, body) {
            t.equal(body, "json", "body is incorrect")

            t.end()
        })
    })

    test("test form path", function (t) {
        request({
            uri: "/"
            , headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        }, function (err, res, body) {
            t.equal(body, "form", "body is incorrect")

            t.end()
        })
    })

    test("test default path", function (t)  {
        request("/", function (err, res, body) {
            t.equal(body, "normal", "default is incorrect")

            t.end()
        })
    })

    .on("end", done)
}