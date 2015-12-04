var extend = require("xtend")
var sendJson = require("./json")
var isSendObject = require("./is-send-object.js")

module.exports = sendError

function sendError(req, res, opts, callback) {
    if (!isSendObject(opts)) {
        opts = { body: opts, statusCode: 500 }
    }

    var error = opts.body

    if (Array.isArray(error)) {
        opts.body = { errors: error }
    } else if (typeof error === "string") {
        opts.body = { errors: [{ message: error, attribute: "general" }] }
    } else if (error && typeof error.message === "string") {
        Object.defineProperty(error, "message", {
            value: error.message,
            enumerable: true,
            writable: true,
            configurable: true
        })
        Object.defineProperty(error, "type", {
            value: error.type,
            enumerable: true,
            writable: true,
            configurable: true
        })

        if (!error.attribute) {
            error.attribute = "general"
        }

        var serializeError = extend(error)

        if (serializeError.domain && 
            typeof serializeError.domain.on === "function"
        ) {
            delete serializeError.domain
            delete serializeError.domainThrown
        }

        if (serializeError.domainEmitter &&
            serializeError.domainEmitter.domain &&
            typeof serializeError.domainEmitter.domain.on === "function"
        ) {
            delete serializeError.domainEmitter
        }

        opts.body = { errors: [serializeError] }
    }

    sendJson(req, res, opts, callback)
}
