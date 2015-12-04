var assert = require("assert"),
    Router = require("../index"),
    router = Router();

(function(){
  //avoid typing assert.blah all over
  for(k in assert){
    this[k] = assert[k];
  }
})();

equal(1, 1);

var noop = function(){};

var cases = [
  {
    path: "/lang",
    testMatch: {
      "/lang" :{
        fn: noop,
        params: {},
        splats: []
      },
      "/lang/" :{
        fn: noop,
        params: {},
        splats: []
      }
    }
  },
  {
    path: "/lang/:lang([a-z]{2})",
    testMatch :{
      "/lang/de":{
        fn: noop,
        params: {
          "lang":"de"
        },
        splats:[]
      }
    },
    testNoMatch: ["/lang/who", "/lang/toolong", "/lang/1"]
  },
  {
    path: "/normal/:id",
    testMatch: {
      "/normal/1":{
        fn: noop,
        params: {
          id: "1"
        },
        splats: []
      }
    },
    testNoMatch: ["/normal/1/updates"]
  },
  {
    path: "/optional/:id?",
    testMatch: {
      "/optional/1":{
        fn: noop,
        params: {
          id: "1"
        },
        splats: []
      },
      "/optional/":{
        fn: noop,
        params: {
          id: undefined
        },
        splats: []
      }
    },
    testNoMatch: ["/optional/1/blah"]
  },
  {
    path: "/empty/*",
     testMatch: {
        "/empty/":{
          fn: noop,
          params: { },
          splats:[""],
        }
      },
    testNomatch: [ "/empty" ]
  },
  {
    path: "/whatever/*.*",
     testMatch: {
        "/whatever/1/2/3.js":{
          fn: noop,
          params: { },
          splats:["1/2/3", "js"],
        }
      },
    testNomatch: [ "/whatever/" ]
  },
  {
    path: "/files/*.*",
    testMatch: {
      "/files/hi.json":{
        fn: noop,
        params: {},
        splats: ["hi", "json"]
      },
      "/files/blah/blah.js":{
        fn: noop,
        params: {},
        splats: ["blah/blah", "js"]
      }
    },
    testNoMatch: ["/files/", "/files/blah"]
  },
  {
    path: "/transitive/:kind/:id/:method?.:format?",
    testMatch: {
      "/transitive/users/ekjnekjnfkej":  {
        fn: noop,
        params: {
          "kind":"users",
          "id":"ekjnekjnfkej",
          "method": undefined,
          "format": undefined },
        splats:[],
      },
      "/transitive/users/ekjnekjnfkej/update": {
        fn: noop,
        params: {
          "kind":"users",
          "id":"ekjnekjnfkej",
          "method": "update",
          "format": undefined },
        splats:[],
      },
      "/transitive/users/ekjnekjnfkej/update.json": {
        fn: noop,
        params: {
          "kind":"users",
          "id":"ekjnekjnfkej",
          "method": "update",
          "format": "json" },
        splats:[],
      }
    },
    testNoMatch: ["/transitive/kind/", "/transitive/"]
  },
  {
    path: /^\/(\d{2,3}-\d{2,3}-\d{4})\.(\w*)$/,
    testMatch :{
      "/123-22-1234.json":{
        fn: noop,
        params: {},
        splats:["123-22-1234", "json"]
      }
    },
    testNoMatch: ["/123-1-1234.png", "/123-22-1234", "/123.png"]
  },
  {
    path: "/cat/*",
    testMatch: {
      "/cat/%" :{
        fn: noop,
        params: {},
        splats: ['%']
      }
    }
  },
  {
    path: "*://*example.com/:foo/*/:bar",
    testMatch: {
      "http://www.example.com/the/best/test" :{
        fn: noop,
        params: {
          "foo":"the",
          "bar":"test"
        },
        splats: ["http","www.","best"]
      }
    }
  },
  {
    path: "*://*example2.com/:foo/*/:bar",
    testMatch: {
      "http://example2.com/the/best/test" :{
        fn: noop,
        params: {
          "foo":"the",
          "bar":"test"
        },
        splats: ["http","","best"]
      }
    }
  }
];

//load routes
for(caseIdx in cases){
  test = cases[caseIdx];
  router.addRoute(test.path, noop);
}

var assertCount = 0;

//run tests
for(caseIdx in cases){
  test = cases[caseIdx];
  for(path in test.testMatch){
    match = router.match(path);
    fixture = test.testMatch[path];

    //save typing in fixtures
    fixture.route = test.path.toString(); // match gets string, so ensure same type
    delete match.next; // next shouldn't be compared
    deepEqual(match, fixture);
    assertCount++;
  }

  for(noMatchIdx in test.testNoMatch){
    match = router.match(test.testNoMatch[noMatchIdx]);
    strictEqual(match, undefined);
    assertCount++;
  }
}

//test exceptions
assert.throws(
  function() {
    router.addRoute();
  }
  , /route requires a path/
  , "expected 'route requires a path' error"
);

assertCount++;

assert.throws(
  function() {
    router.addRoute('/');
  }
  , /route \/ requires a callback/
  , "expected 'route requries a callback' error"
);

assertCount++;

// test next
router.addRoute("/*?", noop);
router.addRoute("/next/x", noop);
var match = router.match("/next/x");
equal(typeof match.next, "function")
strictEqual(match.route, "/*?");
assertCount++;
var next = match.next();
strictEqual(next.route, "/next/x");
assertCount++;

// test remove
equal(router.routes.length, 14);
equal(Object.keys(router.routeMap).length, 14);
router.removeRoute('/next/x');
equal(router.routes.length, 13);
equal(Object.keys(router.routeMap).length, 13);
assertCount++;
match = router.match('/next/x');
// next still available, just returns undefined
equal(typeof match.next, "function");
next = match.next();
strictEqual(next, undefined);
assertCount++

console.log(assertCount.toString()+ " assertions made succesfully");
