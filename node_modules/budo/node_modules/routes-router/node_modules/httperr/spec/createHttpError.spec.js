/*global describe, it */
var expect = require('expect.js'),
  rewire = require('rewire'),
  httperr = rewire('../'),
  HttpError = httperr.HttpError,
  indent = httperr.__get__('indent'),
  createHttpError = httperr.createHttpError;

function dedent(str) {
  return str.slice(4);
}

describe('createHttpError', function() {
  it('is a function', function() {
    expect(createHttpError).to.be.a('function');
  });
  it('returns a constructor', function() {
    var Err = createHttpError(999, 'Some error');
    expect(Err).to.be.a('function');
    expect(Err).to.have.property('prototype');
    expect(Err.prototype).to.be.an('object');
    expect(Err.prototype).to.have.property('constructor', Err);
  });
});

describe('createHttpError(status, title, [init])', function() {
  var Err = createHttpError(999, 'Some error');
  it('returns an HttpError constructor', function() {
    var err = new Err();
    expect(err).to.be.an(HttpError);
    expect(HttpError.prototype.isPrototypeOf(err)).to.equal(true);
    expect(err).to.be.an(Error);
    expect(Error.prototype.isPrototypeOf(err)).to.equal(true);
  });
  it('can be used without the "new" keyword', function() {
    var err = Err();
    expect(err).to.be.an(HttpError);
    expect(HttpError.prototype.isPrototypeOf(err)).to.equal(true);
    expect(err).to.be.an(Error);
    expect(Error.prototype.isPrototypeOf(err)).to.equal(true);
  });
  it('sets "statusCode" to the given status', function() {
    expect(Err.prototype).to.have.property('statusCode', 999);
  });
  it('sets "title" to the given title', function() {
    expect(Err.prototype).to.have.property('title', 'Some error');
  });
  it('sets "name" to the camel-cased title', function() {
    expect(Err.prototype).to.have.property('name', 'SomeError');
  });
  it('sets "code" to the uppercased title', function() {
    expect(Err.prototype).to.have.property('code', 'SOME_ERROR');
  });
});

describe('new NotFound(opts)', function() {
  var NotFound = httperr.NotFound;
  it('calls the init function', function() {
    var initCalled = false;
    createHttpError(999, 'Some error', function() {
      initCalled = true;
    })();
    expect(initCalled).to.equal(true);
  });
  it('saves the stacktrace', function() {
    var err = new NotFound();
    var stack = err.stack.split('\n');
    expect(stack[0]).to.equal(err.name);
  });
  it('adds opts.cause to the stacktrace if it is a string', function() {
    var err = new NotFound({message: 'wat'});
    var stack = err.stack.split('\n');
    expect(stack[0]).to.equal(err.name + ': ' + err.message);
  });
  it('adds opts.cause\'s stack to the stacktrace if it has one', function() {
    var err = new NotFound({cause: {stack: 'X\n' + indent('Bar')}});
    var stack = err.stack.split('\n');
    expect(stack[0]).to.equal(err.name);
    expect(stack.slice(-2).map(dedent)).to.eql(['from X', indent('Bar')]);
  });
});

describe('new Unauthorized(opts)', function() {
  var Unauthorized = httperr.Unauthorized;
  it('sets "authenticate" to opts.authenticate', function() {
    var obj = {}, err = new Unauthorized({authenticate: obj});
    expect(err.authenticate).to.equal(obj);
  });
});

describe('new MethodNotAllowed(opts)', function() {
  var MethodNotAllowed = httperr.MethodNotAllowed;
  it('sets "allowed" to opts.allowed', function() {
    var obj = {}, err = new MethodNotAllowed({allowed: obj});
    expect(err.allowed).to.equal(obj);
  });
});

describe('new ProxyAuthenticationRequired(opts)', function() {
  var ProxyAuthenticationRequired = httperr.ProxyAuthenticationRequired;
  it('sets "proxyAuthenticate" to opts.proxyAuthenticate', function() {
    var obj = {}, err = new ProxyAuthenticationRequired({proxyAuthenticate: obj});
    expect(err.proxyAuthenticate).to.equal(obj);
  });
});

describe('new RequestedRangeNotSatisfiable(opts)', function() {
  var RequestedRangeNotSatisfiable = httperr.RequestedRangeNotSatisfiable;
  it('sets "contentRange" to opts.contentRange', function() {
    var obj = {}, err = new RequestedRangeNotSatisfiable({contentRange: obj});
    expect(err.contentRange).to.equal(obj);
  });
});

describe('new EnhanceYourCalm(opts)', function() {
  var EnhanceYourCalm = httperr.EnhanceYourCalm;
  it('sets "retryAfter" to opts.retryAfter', function() {
    var obj = {}, err = new EnhanceYourCalm({retryAfter: obj});
    expect(err.retryAfter).to.equal(obj);
  });
});

describe('new TooManyRequests(opts)', function() {
  var TooManyRequests = httperr.TooManyRequests;
  it('sets "retryAfter" to opts.retryAfter', function() {
    var obj = {}, err = new TooManyRequests({retryAfter: obj});
    expect(err.retryAfter).to.equal(obj);
  });
});

describe('new RetryWith(opts)', function() {
  var RetryWith = httperr.RetryWith;
  it('sets "parameters" to opts.parameters', function() {
    var obj = {}, err = new RetryWith({parameters: obj});
    expect(err.parameters).to.equal(obj);
  });
});

describe('new Redirect(opts)', function() {
  var Redirect = httperr.Redirect;
  it('sets "location" to opts.location', function() {
    var obj = {}, err = new Redirect({location: obj});
    expect(err.location).to.equal(obj);
  });
});

describe('new ServiceUnavailable(opts)', function() {
  var ServiceUnavailable = httperr.ServiceUnavailable;
  it('sets "retryAfter" to opts.retryAfter', function() {
    var obj = {}, err = new ServiceUnavailable({retryAfter: obj});
    expect(err.retryAfter).to.equal(obj);
  });
});
