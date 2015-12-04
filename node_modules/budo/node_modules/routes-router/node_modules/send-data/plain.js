var send = require("./index")

module.exports = sendPlain

function sendPlain(req, res, opts, callback) {
    if (typeof opts === "string" || Buffer.isBuffer(opts)) {
        opts = { body: opts }
    }

    opts.headers = opts.headers || {}
    opts.headers["Content-Type"] = "text/plain; charset=utf-8"

    send(req, res, opts, callback)
}
