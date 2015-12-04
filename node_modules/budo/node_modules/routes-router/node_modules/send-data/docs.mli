type ErrorObject := { attribute: String, message: String }
type MaybeErrorObject := Array<ErrorObject> | String | Error
type SendObject<T> := {
    headers?: Object<String, String>,
    body?: T,
    statusCode?: Number,
    gzip?: Boolean
}
type SendValue<T> := T | SendObject<T>

send-data := (HttpRequest, HttpResponse, SendValue<Buffer | String>, Callback)

send-data/json := (HttpRequest, HttpResponse, Any | (SendObject<Any> & {
    pretty?: Boolean,
    space?: String,
    replace?: Function
}), Callback)

send-data/html := (HttpRequest, HttpResponse, SendValue<String>, Callback)

send-data/css := (HttpRequest, HttpResponse, SendValue<String>, Callback)

send-data/error := (HttpRequest, HttpResponse,
    SendValue<MaybeErrorObject>, Callback)
