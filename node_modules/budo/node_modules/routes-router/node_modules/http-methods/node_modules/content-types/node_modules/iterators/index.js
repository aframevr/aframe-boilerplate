module.exports = {
    // sync
    forEachSync: require("./lib/sync/forEach")
    , filterSync: require("./lib/sync/filter")
    , mapSync: require("./lib/sync/map")
    , reduceSync: require("./lib/sync/reduce")
    , reduceRightSync: require("./lib/sync/reduceRight")
    , everySync: require("./lib/sync/every")
    , someSync: require("./lib/sync/some")
    // async
    , forEach: require("./lib/async/forEach")
    , filter: require("./lib/async/filter")
    , map: require("./lib/async/map")
    , reduce: require("./lib/async/reduce")
    , reduceRight: require("./lib/async/reduceRight")
    , every: require("./lib/async/every")
    , some: require("./lib/async/some")
}