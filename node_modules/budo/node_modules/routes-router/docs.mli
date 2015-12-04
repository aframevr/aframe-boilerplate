type Callback : (Error | null) => void

type RoutePattern := String

type RouteHandler := (
    req: Object,
    res: Object,
    opts: Object & {
        params: Object<String, String>,
        splats: Array<String>
        parsedUrl: Object
    },
    cb: Callback
) => void

type Route : {
    re: RegExp,
    src: String,
    keys: Array<String>
}

type RouteMatch := {
    fn: RouteHandler,
    params: Object<String, String>,
    splats: Array<String>
}

type Router : {
    routes: Array<Route>,
    routeMap: Object<String, Route>,
    match: (this: Router, String) => null | RouteMatch
    addRoute: (this: Router, RoutePattern, RouteHandler) => void
    prefix: (this: Router, String, RouteHandler) => void,
    handleRequest: (
        this: Router,
        req: Object,
        res: object,
        opts?: Object,
        cb?: Callback
    ) => void
} & (
    req: Object,
    res: Object,
    opts?: Object,
    cb?: Callback
) => void

routes-router : () => Router
