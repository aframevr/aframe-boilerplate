var domain = require("domain")
var inherits = require("inherits")
var mutableExtend = require("xtend/mutable")

var Router = require("./index.js").Router

function DomainRouter(opts) {
    if (!(this instanceof DomainRouter)) {
        return new DomainRouter(opts)
    }

    opts = opts || {}

    Router.call(this, opts)

    this.teardown = opts.teardown || rethrow
}

inherits(DomainRouter, Router)

DomainRouter.prototype.handleRequest =
    function handleRequest(req, res, opts, callback) {
        if (typeof opts === "function") {
            callback = opts
            opts = null
        }

        var self = this
        opts = opts || {}
        callback = callback ||
            this.defaultHandler.bind(null, req, res)

        var d = domain.create()
        d.add(req)
        d.add(res)
        d.on("error", function (err) {
            err.handlingError = null
            try {
                callback(err)
            } catch (error) {
                err.handlingError = error
                if (!res.finished) {
                    res.end()
                }
            }
            d.exit()
            self.teardown(err)
        });

        d.run(function () {
            Router.prototype.handleRequest.call(self,
                req, res, opts, callback)
        })
    }

module.exports = createRouter

function createRouter(opts) {
    var router = DomainRouter(opts)

    var handleRequest = router.handleRequest.bind(router)
    return mutableExtend(handleRequest, router, {
        addRoute: router.addRoute,
        handleRequest: router.handleRequest
    })
}


function rethrow(err) {
    process.nextTick(function () {
        // fix the process.domain stack
        if (process.domain) {
            process.domain.exit()
        }
        throw err
    })
}
