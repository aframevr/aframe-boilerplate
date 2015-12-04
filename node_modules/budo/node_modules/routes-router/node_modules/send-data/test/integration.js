var test = require("tape")
var send = require("..")
var testServer = require("test-server")
var sendJson = require("../json")
var sendHtml = require("../html")
var sendPlain = require("../plain")

testServer(handleRequest, startTest)

function handleRequest(req, res) {
    if (req.url === "/send") {
        send(req, res, {
            body: "foo",
            statusCode: 202,
            headers: {
                bar: "baz"
            }
        })
    } else if (req.url === "/optional") {
        send(req, res, "foo")
    } else if (req.url === "/json") {
        sendJson(req, res, {
            body: {
                foo: "bar"
            },
            statusCode: 201
        })
    } else if (req.url === "/json/optional") {
        sendJson(req, res, {
            foo: "bar"
        })
    } else if (req.url === "/json/shared") {
        var shared = { foo: "bar" }

        sendJson(req, res, {
            shared1: shared,
            shared2: shared
        })
    } else if (req.url === "/json/circular") {
        var circular = {}
        circular.circular = circular

        sendJson(req, res, circular, function (err) {
            if (err) {
                res.end(err.message)
            }
        })
    } else if (req.url === "/html") {
        sendHtml(req, res, {
            body: "<div>foo</div>",
            statusCode: 200,
            headers: {}
        })
    } else if (req.url === "/html/optional") {
        sendHtml(req, res, "<div>foo</div>")
    } else if (req.url === "/plain") {
        sendPlain(req, res, {
            body: "OK",
            statusCode: 200,
            headers: {}
        })
    } else if (req.url === "/plain/optional") {
        sendPlain(req, res, "OK")
    }
}

function startTest(request, done) {
    test("send", function (t) {
        request("/send", function (err, res, body) {
            t.equal(body, "foo")
            t.equal(res.statusCode, 202)
            t.equal(res.headers.bar, "baz")

            t.end()
        })
    })

    test("optional", function (t) {
        request("/optional", function (err, res, body) {
            t.equal(body, "foo")
            t.equal(res.statusCode, 200)

            t.end()
        })
    })

    test("json", function (t) {
        request("/json", function (err, res, body) {
            var data = JSON.parse(body)

            t.equal(data.foo, "bar")
            t.equal(res.statusCode, 201)
            t.equal(res.headers["content-type"], "application/json")

            t.end()
        })
    })

    test("json-optional", function (t) {
        request("/json/optional", function (err, res, body) {
            var data = JSON.parse(body)

            t.equal(data.foo, "bar")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "application/json")

            t.end()
        })
    })

    test("html", function (t) {
        request("/html", function (err, res, body) {
            t.equal(body, "<div>foo</div>")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "text/html")

            t.end()
        })
    })

    test("html-optional", function (t) {
        request("/html/optional", function (err, res, body) {
            t.equal(body, "<div>foo</div>")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "text/html")

            t.end()
        })
    })

    test("plain", function (t) {
        request("/plain", function (err, res, body) {
            t.equal(body, "OK")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "text/plain; charset=utf-8")

            t.end()
        })
    })

    test("plain-optional", function (t) {
        request("/plain/optional", function (err, res, body) {
            t.equal(body, "OK")
            t.equal(res.statusCode, 200)
            t.equal(res.headers["content-type"], "text/plain; charset=utf-8")

            t.end()
        })
    })

    test("shared-json", function (t) {
        request("/json/shared", function (err, res, body) {
            var data = JSON.parse(body)

            t.equal(res.statusCode, 200)
            t.equal(data.shared1.foo, "bar")
            t.equal(data.shared2.foo, "bar")

            t.end()
        })
    })

    test("circular-json", function (t) {
        request("/json/circular", function (err, res, body) {

            t.equal(res.statusCode, 200)
            t.equal(res.body, "Converting circular structure to JSON")

            t.end()
        })
    })

    .on("end", done)
}
