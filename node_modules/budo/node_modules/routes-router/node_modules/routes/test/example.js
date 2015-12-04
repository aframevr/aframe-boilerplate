var Router = require("../index");
var router = Router();

var noop = function(){};

router.addRoute("/articles/:title?", noop);
router.addRoute("/assets/*", noop);
router.addRoute("/:controller/:action/:id.:format?", noop);

console.log(router.match("/articles"));
console.log(router.match("/articles/never-gonna-let-you-down"));
console.log(router.match("/assets/one/two/three/pic.jpg"));
console.log(router.match("/posts/show/1.json"));