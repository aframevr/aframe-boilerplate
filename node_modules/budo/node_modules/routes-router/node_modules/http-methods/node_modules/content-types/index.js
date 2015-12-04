var some = require("iterators").someSync

module.exports = contentTypes

function contentTypes(req, res, object) {
    var contentType = req.headers["content-type"] || ""

    // Content-Type is allowed to have parameters in it
    return some(object, findFirstMatch, contentType) || object.default
}

function findFirstMatch(value, key) {
    if (this.indexOf(key) !== -1) {
        return value
    }
}