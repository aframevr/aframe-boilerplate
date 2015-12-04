module.exports = isSendObject

function isSendObject(object) {
    return object &&
        (typeof object.statusCode === "number" ||
        (typeof object.headers === "object" && object.headers !== null))
}
