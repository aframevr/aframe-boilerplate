# response-stream

Pass http server response methods through to the next destination pipe.

This is useful if you want to write duplex streams that will be piped into an
http server response (`.pipe(res)`).

[![build status](https://secure.travis-ci.org/substack/response-stream.png)](http://travis-ci.org/substack/response-stream)

# example

``` js
var http = require('http');
var es = require('event-stream');
var filed = require('filed');
var responseStream = require('response-stream');

var server = http.createServer(function (req, res) {
    filed(__dirname + '/data.txt')
        .pipe(capStream())
        .pipe(res)
    ;
});
server.listen(8000);

function capStream () {
    return responseStream(es.mapSync(function (s) {
        return String(s).toUpperCase()
    }));
}
```
now our stream works plus we get all the nifty http headers from
[filed](http://github.com/mikeal/filed):

```
$ curl -i localhost:8000
HTTP/1.1 200 OK
content-type: text/plain
etag: f11d6d78081ea6d84ce2592001e9b510
last-modified: Tue, 28 Aug 2012 19:01:19 -0700
content-length: 10
Connection: keep-alive

BEEP BOOP
```

# methods

``` js
var responseStream = require('response-stream')
```

## var rs = responseStream(stream)

Return a new [duplex stream](http://github.com/substack/stream-handbook#duplex)
from `stream` with all of the http server response methods that will be passed
through to the destination response object.

# events

## rs.on('response', res)

Emitted after when the response object is available. All of the proxied methods
will be passed through before this event fires

## rs.on(method, args, prevent)

For each `method`: `'writeContinue'`, `'writeHead'`, `'setHeader'`,
`'sendDate'`, `'getHeader'`, `'removeHeader'`, `'addTrailers'`

corresponding to the http server response method, emit an event before the
method is called on the actual response or saved with the arguments and a
`prevent()` function that prevents passing the method call back to the response
object.

# install

With [npm](https://npmjs.org) do:

```
npm install response-stream
```

# license

MIT
