var Buffer = require("buffer").Buffer;
var send = require("./index")

module.exports = sendHtml

function sendHtml(req, res, opts, callback) {
    if (typeof opts === "string" || Buffer.isBuffer(opts)) {
        opts = { body: opts }
    }

    opts.headers = opts.headers || {}
    opts.headers["Content-Type"] = "text/html"

    send(req, res, opts, callback)
}
