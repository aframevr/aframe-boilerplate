var test = require('tape');
var MockRequest = require('../index.js').Request;
var MockResponse = require('../index.js').Response;
var Cookies = require('cookies');

test('Create request with cookie', function(t) {
  var req = new MockRequest({
    url: '/hello',
    cookies: {
      foo: 'bar',
      bar: 'baz'
    }
  });
  var res = new MockResponse();

  t.ok(req, 'Request was created');

  var cookies = new Cookies(req, res);
  var foo = cookies.get('foo');
  var bar = cookies.get('bar');

  t.equal(foo, 'bar', 'Cookie (foo) should return the original value.');
  t.equal(bar, 'baz', 'Cookie (bar) should return the original value.');
  t.end();

});

test('can create with cookie header', function (t) {
  var req = new MockRequest({
    headers: {
      cookie: 's=foo'
    }
  });

  t.ok(req);
  t.equal(req.headers.cookie, 's=foo');

  t.end();
});
