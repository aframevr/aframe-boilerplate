var test = require('tape');
var MockRequest = require('../index.js').Request;
var MockResponse = require('../index.js').Response;
var Cookies = require('cookies');

test('Create  post request', function(t) {
  var req = new MockRequest({
    method: 'POST',
    url: '/hello',
    headers: {
      'Content-Type': 'text/plain'
    },
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

  req.on('data', function(body) {
    t.equals(body.toString(), 'foobar', 'Body should have been pushed from mock req.');
    t.end();
  });

  req.write('foo');
  req.end('bar');
});