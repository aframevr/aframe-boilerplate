var contentTypes = require("content-types")
    , body = require("body")
    , jsonBody = body.json
    , formBody = body.form

module.exports = methods

function methods(routes, handleHttpForms) {
    return handleHttpForms ? formRequestHandler : requestHandler

    function requestHandler(req) {
        var method = req.method
            , f = routes[method] || routes.notFound || notFound

        return f.apply(this, arguments)
    }

    function formRequestHandler(req, res) {
        var args = arguments
            , self = this

        contentTypes(req, res, {
            "application/json": jsonBody
            , "application/x-www-form-urlencoded": formBody
            , "default": callRequestHandler
        })(req, res, extractMethod)

        function callRequestHandler() {
            requestHandler.apply(self, args)
        }

        function extractMethod(err, body) {
            var method = body._method
                , f = routes[method] || routes.notFound || notFound

            return f.apply(self, args)
        }
    }
}

function notFound(req, res) {
    res.statusCode = 405
    res.end("405 Method Not Allowed " + req.url)
}