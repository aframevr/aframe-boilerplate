# routes-router

[![deprecated](http://hughsk.github.io/stability-badges/dist/deprecated.svg)](http://github.com/hughsk/stability-badges) [![dependency status][3]][4]

Simplest request handler possible

# **DEPRECATED** Use [http-hash-router](https://github.com/Matt-Esch/http-hash-router) instead

## Example

```js
var Router = require("routes-router")
var http = require("http")

var router = Router()

http.createServer(router)

router.addRoute("/foo", function (req, res) {
    res.end("hello!")
})

router.addRoute("/bars/:barName", function (req, res, opts) {
    res.end("you request bars " + opts.params.barName)
})

router.addRoute("/foos/:fooName", function (req, res, opts, cb) {
    db.get(opts.params.fooName, function (err, value) {
        if (err) return cb(err)

        res.end(JSON.stringify(value))
    })
})

router.addRoute("/baz/:things", {
    GET: function (req, res) {
        res.end("I will give you your thing")
    },
    POST: function (req, res) {
        res.end("got your things")
    }
})
```

## Error handling with a router

You can use a router to do central error handling

```js
var Router = require("routes-router")
var sendError = require("send-data/error")
var uuid = require("uuid")

var router = Router({
  errorHandler: function (req, res, err) {
    err.id = uuid()

    // log it somewhere
    logError(req, res, err)

    // if req is json
    if (isJson(req)) {
      sendError(req, res, err)
    } else {
      // render HTML 500 page
      renderErrorPage(req, res, err)
    }
  },
  teardown: function (req, res, err) {
    // an unexcepted exception occured
    // process is in corrupted state
    // you have to shut it down
    // see node domains docs
  },
  notFound: function (req, res) {
    // render a custom 404 page
    renderNotfoundPage(req, res)
  }
})
```

## Cascading errors in a tree of routers

Since a `Router` just returns a `function (req, res) {}` you can 
  add routers to a router

Here we can just embed a `Router` instance in another router
  instance. A child router will use the parent router's callback
  so all error handling is managed in the parent, not the child.

This means you can define your error handling in your parent
  and all children will re-use that error handling logic.

Note that we use the `.prefix()` instead of `.addRoute()` 
  method to add child routers. The `.prefix()` ensures that
  both `/user`, `/user/` and `/user/*?` goes to the child router.

```js
var Router = require("routes-router")

var app = Router({
  errorHandler: function (req, res) {
    res.statusCode = 500
    res.end("no u")
  },
  notFound: function (req, res) {
    res.statusCode = 404
    res.end("oh noes")
  }
})

var users = Router()
var posts = Router()

app.prefix("/user", users)
app.prefix("/post", posts)

users.addRoute("/", function (req, res) {
  res.end("all users")
})
users.addRoute("/:id", function (req, res, opts) {
  res.end("user " + opts.params.id)
})

posts.addRoute("/", function (req, res) {
  res.end("all posts")
})
posts.addRoute("/:id", function (req, res, opts) {
  res.end("post " + opts.params.id)
})
```


## Installation

`npm install routes-router`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/routes-router.png
  [2]: http://travis-ci.org/Raynos/routes-router
  [3]: https://david-dm.org/Raynos/routes-router/status.png
  [4]: https://david-dm.org/Raynos/routes-router
  [5]: https://ci.testling.com/Raynos/routes-router.png
  [6]: https://ci.testling.com/Raynos/routes-router
