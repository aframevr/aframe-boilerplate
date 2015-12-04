var test = require("tap").test
    , methods = require("..")
    , testServer = require("test-server")

testServer(handleRequest, startTests)

function handleRequest(req, res) {
    var get = endValue("get")
        , post = endValue("post")
        , put = endValue("put")
        , del = endValue("del")

    if (req.url === "/form") {
        return methods({
            "GET": get
            , "POST": post
            , "PUT": put
            , "DELETE": del
        }, true).apply(this, arguments)
    }

    methods({
        "PUT": put
        , "GET": get
        , "POST": post
    }).apply(this, arguments)
}

function endValue(value) {
    return function (req, res) { res.end(value) }
}

function startTests(request, done) {
    test("get", function (t) {
        request("/", testMethod("get", t))
    })

    test("post", function (t) {
        request({
            uri: "/"
            , method: "POST"
        }, testMethod("post", t))
    })

    test("put", function (t) {
        request({
            uri: "/"
            , method: "PUT"
        }, testMethod("put", t))
    })

    test("form get", function (t) {
        request("/form", testMethod("get", t))
    })

    test("form post", function (t) {
        request({
            uri: "/form"
            , method: "POST"
        }, testMethod("post", t))
    })

    test("form put", function (t) {
        request({
            uri: "/form"
            , method: "POST"
            , form: {
                _method: "PUT"
            }
        }, testMethod("put", t))
    })

    test("form delete", function (t) {
        request({
            uri: "/form"
            , method: "POST"
            , form: {
                _method: "DELETE"
            }
        }, testMethod("del", t))
    })

    test("error", function (t) {
        request({
            uri: "/"
            , method: "DELETE"
        }, function (err, res, body) {
            t.equal(res.statusCode, 405)
            t.equal(body, "405 Method Not Allowed /")

            t.end()
        })
    })

    .on("end", done)
}

function testMethod(value, t) {
    return function (err, res, body) {
        t.equal(body, value)

        t.end()
    }
}