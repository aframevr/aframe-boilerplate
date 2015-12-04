var send = require("./index")

module.exports = sendJavascript

function sendJavascript(req, res, opts, callback) {
    if (typeof opts === "string" || Buffer.isBuffer(opts)) {
        opts = { body: opts }
    }

    opts.headers = opts.headers || {}
    opts.headers["Content-Type"] = "text/javascript"

    send(req, res, opts, callback)
}
