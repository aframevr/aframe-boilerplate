var sendError = require("send-data/error")

module.exports = createDefaultHandler

function createDefaultHandler(opts) {
    var notFound = opts.notFound || defaultNotFound
    var errorHandler = opts.errorHandler || defaultErrorHandler

    return defaultHandler

    function defaultHandler(req, res, err) {
        if (err) {
            if (err.statusCode === 404) {
                return notFound(req, res, err)
            }

            errorHandler(req, res, err)
        }
    }
}

function defaultErrorHandler(req, res, err) {
    sendError(req, res, {
        body: err,
        statusCode: err.statusCode || 500
    })
}

function defaultNotFound(req, res) {
    res.statusCode = 404
    res.end("404 Not Found")
}
