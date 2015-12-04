// var stringify = require("json-stringify-safe")

var send = require("./index")
var isSendObject = require("./is-send-object")

module.exports = sendJson

function sendJson(req, res, opts, callback) {
    if (!isSendObject(opts)) {
        opts = { body: opts }
    }

    opts = opts || {}
    if (opts.pretty) {
        opts.space = "    "
    }

    var tuple = safeStringify(opts.body,
        opts.replacer || null, opts.space || "");

    if (tuple[0]) {
        return callback(tuple[0]);
    }

    opts.headers = opts.headers || {}
    opts.body = tuple[1];
    opts.headers["Content-Type"] = "application/json"

    send(req, res, opts, callback)
}

function safeStringify(obj, replace, space) {
    var json;
    var error = null;

    try {
        json = JSON.stringify(obj, replace, space);
    } catch (e) {
        error = e;
    }

    return [error, json];
}
