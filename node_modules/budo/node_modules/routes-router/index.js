var RoutesRouter = require("routes")
var url = require("url")
var methods = require("http-methods")
var extend = require("xtend")
var TypedError = require("error/typed")
var mutableExtend = require("xtend/mutable")

var createDefaultHandler = require("./default-handler.js")

var NotFound = TypedError({
    statusCode: 404,
    message: "resource not found {url}",
    notFound: true
})

function Router(opts) {
    if (!(this instanceof Router)) {
        return new Router(opts)
    }

    opts = opts || {};

    this.defaultHandler = createDefaultHandler(opts)
    var router = this.router = RoutesRouter()
    this.routes = router.routes
    this.routeMap = router.routeMap
    this.match = router.match.bind(router)
}

Router.prototype.addRoute = function addRoute(uri, fn) {
    if (typeof fn === "object") {
        fn = methods(fn)
    }

    var msg;
    if (this.router.routeMap[uri]) {
        msg = 'routes-router: Cannot add route, route already ' +
            'exists.\n' +
            'You\'ve called `router.addRoute("' + uri + '")` ' +
            'twice.\n'
        throw new Error(msg)
    }

    this.router.addRoute(uri, fn)
}

Router.prototype.removeRoute = function removeRoute(uri) {
    this.router.removeRoute(uri);
}

Router.prototype.prefix = function prefix(uri, fn) {
    var msg;
    if (typeof uri !== 'string') {
        msg = 'routes-router: must call ' +
            '`router.prefix("/some-prefix", fn)`'
        throw new Error(msg)
    }

    if (uri[uri.length - 1] === '/' && uri.length > 1) {
        msg = 'routes-router: ' +
            '`routes.prefix("/some-prefix/", fn)` is ' +
            'invalid.\n' +
            'Passing a trailing slash does not work.\n';
        throw new Error(msg)
    }

    if (uri[0] !== '/') {
        msg = 'routes-router: ' +
            '`routes.prefix("some-prefix", fn)` is ' +
            'invalid.\n' +
            'Must start "some-prefix" with a leading slash.\n'
        throw new Error(msg)
    }

    var pattern = uri === "/" ? "/*?" : uri + "/*?";

    if (typeof fn === "object") {
        fn = methods(fn)
    }

    this.addRoute(uri, normalizeSplatsFromUri);
    this.addRoute(pattern, normalizeSplatsFromPattern);

    function normalizeSplatsFromUri(req, res, opts) {
        var last = opts.splats.length ?
            opts.splats.length - 1 : 0;
        if (opts.splats[last] === undefined) {
            opts.splats[last] = "/";
        }
        fn.apply(this, arguments);
    }

    function normalizeSplatsFromPattern(req, res, opts) {
        var last = opts.splats.length ?
            opts.splats.length - 1 : 0;
        if (typeof opts.splats[last] === "string") {
            opts.splats[last] = "/" + opts.splats[last];
        }
        fn.apply(this, arguments);
    }
}

Router.prototype.handleRequest =
    function handleRequest(req, res, opts, callback) {
        if (typeof opts === "function") {
            callback = opts
            opts = null
        }

        opts = opts || {};
        callback = callback ||
            this.defaultHandler.bind(null, req, res)

        var pathname

        opts.params = opts.params || {}
        opts.splats = opts.splats || []

        var uri

        if (opts.splats && opts.splats.length) {
            pathname = opts.splats.pop();
        } else {
            uri = url.parse(req.url);
            pathname = uri.pathname;
        }

        var route = this.router.match(pathname);

        if (!route) {
            return callback(NotFound({
                url: req.url
            }))
        }

        var params = extend(opts, {
            params: extend(opts.params, route.params),
            splats: opts.splats.concat(route.splats)
        })

        if (uri) {
            params.parsedUrl = uri;
        }

        if (typeof opts.preHandleHook === 'function') {
            var reqOpts = {
                route: route,
                params: params,
                opts: opts
            };
            opts.preHandleHook({
                req: req,
                reqOpts: reqOpts
            });
            route.fn(req, res, params, callback);
        } else {
            route.fn(req, res, params, callback);
        }
    }

createRouter.Router = Router

module.exports = createRouter

function createRouter(opts) {
    var router = Router(opts)

    var handleRequest = router.handleRequest.bind(router)
    return mutableExtend(handleRequest, router, {
        addRoute: router.addRoute,
        removeRoute: router.removeRoute,
        prefix: router.prefix,
        handleRequest: router.handleRequest
    })
}
