# Routes.js

`routes` lets you easily dispatch based on url-style strings.  It comes with a default `Router` function that you can use to route http requests, but it also cleanly exposes the important functionality so you could also use it to perform more generic string pattern matching.

This might make it useful for things like:

* URI routing
* Cucumber-style pattern matching :)
* Routing messages by channel name from an MQ
* Dispatching hierarchical events by name

## Alternative routers.

This module is no longer actively worked on. This module operates just fine as is,
  however you might want to use a module that is under active maintenance:
  
 - https://github.com/Matt-Esch/http-hash
 - https://github.com/glassresistor/i40
 - https://github.com/bevacqua/ruta3

## Router Example:

The full range of `Path Formats` is documented below.

```js
var Router = require('routes');
var router = Router();
var noop = function(){};

router.addRoute("/articles/:title?", noop);
router.addRoute("/:controller/:action/:id.:format?", noop);

console.log(router.match("/articles"));
console.log(router.match("/articles/never-gonna-let-you-down"));
console.log(router.match("/posts/show/1.json"));

```

The output for `router.match("/posts/show/1.json")` would be:
```js
{
  params: {
    controller: 'posts',
    action: 'show',
    id: '1',
    format: 'json'
  },
  splats: [],
  route: '/:controller/:action/:id.:format?',
  fn: [Function],
  next: [Function]
}
```

In the example above, `fn` would be the function that was passed into the router.


I return this object instead of calling your function for you because you will likely want to add additional parameters from the current context to the function invocation. Ex:

```js
var route = router.match("/posts/show/1.json");
route.fn.apply(null, [req, res, route.params, route.splats]);
```

## Match Continuation

The object returned by `router.match` includes a `next` function you can use to continue matching against subsequent routes. Routes are evaluated in the order they are added to the router, so generally, you would add your most specific routes first and most ambiguous routes last. Using the `next` function allows you evaluate more ambiguous routes first.

```js
var Router = require('routes');
var router = new Router();

router.addRoute('/admin/*?', auth);
router.addRoute('/admin/users', adminUsers);

http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  var match = router.match(path);
  match.fn(req, res, match);
}).listen(1337)

// authenticate the user and pass them on to
// the next route, or respond with 403.
function auth(req, res, match) {
  if (checkUser(req)) {
    match = match.next();
    if (match) match.fn(req, res, match);
    return;
  }
  res.statusCode = 403;
  res.end()
}

// render the admin.users page
function adminUsers(req, res, match) {
  // send user list
  res.statusCode = 200;
  res.end();
}
```

## Installation

    npm install routes

## Path Formats

Basic string:

    "/articles" will only match routes that == "/articles".

Named parameters:

    "/articles/:title" will only match routes like "/articles/hello", but *not* "/articles/".

Optional named parameters:

    "/articles/:title?" will match "/articles/hello" AND "/articles/"

Periods before optional parameters are also optional:

    "/:n.:f?" will match "/1" and "/1.json"

Splaaaat! :

    "/assets/*" will match "/assets/blah/blah/blah.png" and "/assets/".

    "/assets/*.*" will match "/assets/1/2/3.js" as splats: ["1/2/3", "js"]

Mix splat with named parameters:

    "/account/:id/assets/*" will match "/account/2/assets/folder.png" as params: {id: 2}, splats:["folder.png"]


Named RegExp:

    "/lang/:lang([a-z]{2})" will match "/lang/en" but not "/lang/12" or "/lang/eng"

Raw RegExp:

    /^\/(\d{2,3}-\d{2,3}-\d{4})\.(\w*)$/ (note no quotes, this is a RegExp, not a string.) will match "/123-22-1234.json". Each match group will be an entry in splats: ["123-22-1234", "json"]


## Router API

The `Router()` that `routes` exposes has two functions: `addRoute` and `match`.

`addRoute`: takes a `path` and a `fn`. Your `path` can match any of the formats in the "Path Formats" section.

`match`: takes a `String` or `RegExp` and returns an object that contains the named `params`, `splats`, `route` (string that was matched against), the `fn` handler you passed in with `addRoute`, and a `next` function which will run `match` against subsequent routes.

## Library API

`match`: takes an array of `Routes`, and a `String`. It goes through `Routes` and returns an object for the first `Route` that matches the `String`, or `undefined` if none is found. The returned object contains `params`, `splats`, and `route`. `params` is an object containing the named matches, `splats` contains the unnamed globs ("*"), and `route` contains the original string that was matched against.

`pathToRegExp`: takes a `path` string and an empty `keys` array, returns a RegExp and populates `keys` with the names of the match groups that the RegExp will match. This is largely an internal function but is provided in case someone wants to make a nifty string -> [RegExp, keys] utility.


## Test

Clone the repo, cd to it, and:

    make test

## Credits

This library is an extraction and re-factor of the `connect` `router` middleware.  I found that connect-based routing worked reasonably well on the server side, but I wanted to do similar routing based on channel names when using `Push-It` and possibly for event names when using `Evan`.  So, I extracted the relevant goodness out of the `router` middleware and presented it here.  Big thanks to TJ Holowaychuk for writing the original `router` middleware.

## License

This code is distributed under the MIT license, Copyright Aaron Blohowiak and TJ Holowaychuk 2011.
