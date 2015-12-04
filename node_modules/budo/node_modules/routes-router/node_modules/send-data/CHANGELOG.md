# v3.0.5

 - update `send-data/error` to pass extra error objects through
    down the wire.

# v3.0.4

 - throw an exception if you had `{ gzip: true }` and no callback
 - set the gzip header

# v3.0.0

Added gzip support and a callback interface

## Back compat breaking changes

 - sendJson is now `sendJson(req, res, opts)` instead of
    `sendJson(req, res, data, opts)`

## Summary

 - add callback to all methods. This gets called when the response
    finishes or if gzip errors
 - add gzip option to everything
 - fix bug with error's handling of sendObject

# v2.2.1 Initial version
